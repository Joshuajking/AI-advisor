#!/usr/bin/env python3
"""
YouTube Transcript Downloader
Downloads transcripts by video ID and saves them to a folder.

Usage:
    python download_transcripts.py dQw4w9WgXcQ
    python download_transcripts.py dQw4w9WgXcQ abc123xyz vid3
    python download_transcripts.py dQw4w9WgXcQ --output ./my-transcripts
"""

import argparse
import json
import re
import sys
from pathlib import Path

try:
    from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled
except ImportError:
    print("Error: youtube-transcript-api not installed.")
    print("Run: pip install youtube-transcript-api")
    sys.exit(1)


DEFAULT_OUTPUT_DIR = Path(__file__).parent.parent / "ai-advisor" / "data" / "transcripts"


def fetch_transcript(video_id: str, languages: list[str] = None) -> dict | None:
    """Fetch transcript for a single video."""
    languages = languages or ["en"]
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        try:
            transcript = transcript_list.find_transcript(languages)
        except NoTranscriptFound:
            # Fall back to any available language
            transcript = transcript_list.find_generated_transcript(
                list(transcript_list._generated_transcripts.keys())
            )

        entries = transcript.fetch()
        return {
            "video_id": video_id,
            "language": transcript.language_code,
            "is_generated": transcript.is_generated,
            "segments": entries,
            "text": " ".join(entry["text"] for entry in entries),
        }

    except TranscriptsDisabled:
        print(f"  [skip] Transcripts disabled for {video_id}")
    except NoTranscriptFound:
        print(f"  [skip] No transcript found for {video_id}")
    except Exception as e:
        print(f"  [error] {video_id}: {e}")
    return None


def save_transcript(transcript: dict, output_dir: Path) -> Path:
    """Save transcript as JSON and plain text."""
    video_id = transcript["video_id"]
    output_dir.mkdir(parents=True, exist_ok=True)

    # Full JSON with timestamps
    with open(output_dir / f"{video_id}.json", "w", encoding="utf-8") as f:
        json.dump(transcript, f, indent=2, ensure_ascii=False)

    # Plain text for RAG
    txt_path = output_dir / f"{video_id}.txt"
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(f"Video ID: {video_id}\n")
        f.write(f"URL: https://www.youtube.com/watch?v={video_id}\n")
        f.write(f"Language: {transcript['language']} (auto-generated: {transcript['is_generated']})\n")
        f.write("\n--- TRANSCRIPT ---\n\n")
        f.write(transcript["text"])

    return txt_path


def main():
    parser = argparse.ArgumentParser(
        description="Download YouTube transcripts by video ID.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "video_ids",
        nargs="+",
        metavar="VIDEO_ID",
        help="One or more YouTube video IDs (or full YouTube URLs)",
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
    success, skipped = 0, 0

    for i, raw in enumerate(args.video_ids, 1):
        # Strip full URL if pasted (e.g. https://youtube.com/watch?v=abc123)
        video_id = re.sub(r".*[?&]v=", "", raw).split("&")[0]
        print(f"[{i}/{len(args.video_ids)}] {video_id}")

        transcript = fetch_transcript(video_id, args.languages)
        if transcript:
            path = save_transcript(transcript, args.output)
            print(f"  -> saved: {path.name}")
            success += 1
        else:
            skipped += 1

    print(f"\nDone. {success} saved, {skipped} skipped. Output: {args.output}")


if __name__ == "__main__":
    main()
