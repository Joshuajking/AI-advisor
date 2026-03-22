#!/usr/bin/env python3
"""
YouTube Transcript Downloader
Downloads transcripts by video ID or channel ID and saves them to a folder.

Usage:
    # By video ID(s):
    python download_transcripts.py --video-ids dQw4w9WgXcQ abc123xyz

    # By channel ID:
    python download_transcripts.py --channel-id UCxxxxxxxxxxxxxxxxxxxxxx

    # Custom output directory:
    python download_transcripts.py --video-ids dQw4w9WgXcQ --output ./my-transcripts

    # Combine both:
    python download_transcripts.py --channel-id UCxxxxxx --video-ids vid1 vid2
"""

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

try:
    from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled
except ImportError:
    print("Error: youtube-transcript-api not installed.")
    print("Run: pip install youtube-transcript-api")
    sys.exit(1)

try:
    from googleapiclient.discovery import build
    YOUTUBE_API_AVAILABLE = True
except ImportError:
    YOUTUBE_API_AVAILABLE = False


DEFAULT_OUTPUT_DIR = Path(__file__).parent.parent / "ai-advisor" / "data" / "transcripts"


def slugify(text: str) -> str:
    """Convert text to a safe filename."""
    text = re.sub(r"[^\w\s-]", "", text).strip().lower()
    return re.sub(r"[\s_-]+", "-", text)


def fetch_transcript(video_id: str, languages: list[str] = None) -> dict | None:
    """Fetch transcript for a single video. Returns dict with text and metadata."""
    languages = languages or ["en"]
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # Try requested languages first, then fall back to any available
        try:
            transcript = transcript_list.find_transcript(languages)
        except NoTranscriptFound:
            transcript = transcript_list.find_generated_transcript(
                transcript_list._manually_created_transcripts or
                list(transcript_list._generated_transcripts.keys())
            )

        entries = transcript.fetch()
        full_text = " ".join(entry["text"] for entry in entries)

        return {
            "video_id": video_id,
            "language": transcript.language_code,
            "is_generated": transcript.is_generated,
            "segments": entries,
            "text": full_text,
        }

    except TranscriptsDisabled:
        print(f"  [skip] Transcripts disabled for {video_id}")
    except NoTranscriptFound:
        print(f"  [skip] No transcript found for {video_id}")
    except Exception as e:
        print(f"  [error] {video_id}: {e}")
    return None


def save_transcript(transcript: dict, output_dir: Path, title: str = None) -> Path:
    """Save transcript as JSON and plain text."""
    video_id = transcript["video_id"]
    base_name = slugify(title) if title else video_id
    # Avoid collisions when title slugs are identical
    base_name = f"{base_name}_{video_id}"

    output_dir.mkdir(parents=True, exist_ok=True)

    # Save full JSON (includes segments with timestamps)
    json_path = output_dir / f"{base_name}.json"
    with open(json_path, "w", encoding="utf-8") as f:
        data = {**transcript}
        if title:
            data["title"] = title
        json.dump(data, f, indent=2, ensure_ascii=False)

    # Save plain text (easier to read / paste into RAG)
    txt_path = output_dir / f"{base_name}.txt"
    with open(txt_path, "w", encoding="utf-8") as f:
        if title:
            f.write(f"Title: {title}\n")
        f.write(f"Video ID: {video_id}\n")
        f.write(f"URL: https://www.youtube.com/watch?v={video_id}\n")
        f.write(f"Language: {transcript['language']} (auto-generated: {transcript['is_generated']})\n")
        f.write("\n--- TRANSCRIPT ---\n\n")
        f.write(transcript["text"])

    return txt_path


def get_channel_video_ids(channel_id: str, api_key: str, max_results: int = 50) -> list[tuple[str, str]]:
    """Fetch video IDs and titles from a channel using the YouTube Data API."""
    if not YOUTUBE_API_AVAILABLE:
        print("Error: google-api-python-client not installed.")
        print("Run: pip install google-api-python-client")
        sys.exit(1)

    youtube = build("youtube", "v3", developerKey=api_key)
    videos = []
    next_page_token = None

    while len(videos) < max_results:
        request = youtube.search().list(
            part="snippet",
            channelId=channel_id,
            maxResults=min(50, max_results - len(videos)),
            order="date",
            type="video",
            pageToken=next_page_token,
        )
        response = request.execute()

        for item in response.get("items", []):
            video_id = item["id"]["videoId"]
            title = item["snippet"]["title"]
            videos.append((video_id, title))

        next_page_token = response.get("nextPageToken")
        if not next_page_token:
            break
        time.sleep(0.5)  # be kind to the API

    return videos


def process_videos(video_entries: list[tuple[str, str | None]], output_dir: Path, languages: list[str]) -> None:
    """Download and save transcripts for a list of (video_id, title) pairs."""
    success, skipped = 0, 0

    for i, (video_id, title) in enumerate(video_entries, 1):
        display = f"{title} ({video_id})" if title else video_id
        print(f"[{i}/{len(video_entries)}] {display}")

        transcript = fetch_transcript(video_id, languages)
        if transcript:
            path = save_transcript(transcript, output_dir, title)
            print(f"  -> saved: {path.name}")
            success += 1
        else:
            skipped += 1

    print(f"\nDone. {success} saved, {skipped} skipped. Output: {output_dir}")


def main():
    parser = argparse.ArgumentParser(
        description="Download YouTube transcripts by video or channel ID.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )

    parser.add_argument(
        "--video-ids", "-v",
        nargs="+",
        metavar="VIDEO_ID",
        help="One or more YouTube video IDs",
    )
    parser.add_argument(
        "--channel-id", "-c",
        metavar="CHANNEL_ID",
        help="YouTube channel ID (requires --api-key or YOUTUBE_API_KEY env var)",
    )
    parser.add_argument(
        "--api-key", "-k",
        metavar="KEY",
        default=os.environ.get("YOUTUBE_API_KEY"),
        help="YouTube Data API v3 key (or set YOUTUBE_API_KEY env var)",
    )
    parser.add_argument(
        "--max-results", "-m",
        type=int,
        default=50,
        metavar="N",
        help="Max videos to fetch from a channel (default: 50)",
    )
    parser.add_argument(
        "--output", "-o",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        metavar="DIR",
        help=f"Output directory (default: {DEFAULT_OUTPUT_DIR})",
    )
    parser.add_argument(
        "--languages", "-l",
        nargs="+",
        default=["en"],
        metavar="LANG",
        help="Preferred transcript languages in order (default: en)",
    )

    args = parser.parse_args()

    if not args.video_ids and not args.channel_id:
        parser.error("Provide at least --video-ids or --channel-id")

    video_entries: list[tuple[str, str | None]] = []

    # Collect from channel
    if args.channel_id:
        if not args.api_key:
            parser.error(
                "--channel-id requires a YouTube Data API key. "
                "Pass --api-key or set the YOUTUBE_API_KEY environment variable."
            )
        print(f"Fetching up to {args.max_results} videos from channel {args.channel_id}...")
        channel_videos = get_channel_video_ids(args.channel_id, args.api_key, args.max_results)
        print(f"Found {len(channel_videos)} videos.\n")
        video_entries.extend(channel_videos)

    # Collect explicit video IDs (no title available without API)
    if args.video_ids:
        for vid in args.video_ids:
            # Strip URL prefixes if someone pastes a full URL
            vid = re.sub(r".*[?&]v=", "", vid).split("&")[0]
            video_entries.append((vid, None))

    process_videos(video_entries, args.output, args.languages)


if __name__ == "__main__":
    main()
