
"""
YouTube Transcript Downloader - Google Colab Version
Downloads transcripts by video ID and saves them to a folder.

Usage in Colab:
1. First cell: !pip install youtube-transcript-api
2. Second cell: Run this script
3. Modify the video_ids list at the bottom with your video IDs
"""

import json
import re
from pathlib import Path

try:
    from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled
except ImportError:
    print("⚠️  youtube-transcript-api not installed.")
    print("Run this in a cell first: !pip install youtube-transcript-api")
    raise


def fetch_transcript(video_id: str, languages: list = None):
    """Fetch transcript for a single video."""
    languages = languages or ["en"]

    # Clean up video ID (in case full URL is provided)
    video_id = re.sub(r".*[?&]v=", "", video_id).split("&")[0]

    try:
        # Create API instance (correct usage per official docs)
        api = YouTubeTranscriptApi()

        # Fetch transcript
        transcript = api.fetch(video_id, languages=languages)

        # Get snippets (text segments with timestamps)
        snippets = transcript.snippets

        # Convert snippets to dict format
        segments = [
            {
                "text": snippet.text,
                "start": snippet.start,
                "duration": snippet.duration
            }
            for snippet in snippets
        ]

        # Combine all text
        full_text = " ".join(snippet.text for snippet in snippets)

        return {
            "video_id": video_id,
            "language": transcript.language_code,
            "is_generated": transcript.is_generated,
            "segments": segments,
            "text": full_text,
        }

    except TranscriptsDisabled:
        print(f"  [skip] Transcripts disabled for {video_id}")
    except NoTranscriptFound:
        print(f"  [skip] No transcript found for {video_id}")
    except Exception as e:
        print(f"  [error] {video_id}: {e}")
    return None


def save_transcript(transcript: dict, output_dir: str = "transcripts"):
    """Save transcript as JSON and plain text."""
    video_id = transcript["video_id"]
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Full JSON with timestamps
    json_path = output_path / f"{video_id}.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(transcript, f, indent=2, ensure_ascii=False)

    # Plain text for RAG
    txt_path = output_path / f"{video_id}.txt"
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(f"Video ID: {video_id}\n")
        f.write(f"URL: https://www.youtube.com/watch?v={video_id}\n")
        f.write(f"Language: {transcript['language']} (auto-generated: {transcript['is_generated']})\n")
        f.write("\n--- TRANSCRIPT ---\n\n")
        f.write(transcript["text"])

    return txt_path


def download_transcripts(video_ids: list, output_dir: str = "transcripts", languages: list = None):
    """
    Download YouTube transcripts for multiple video IDs.

    Args:
        video_ids: List of YouTube video IDs or full URLs
        output_dir: Directory to save transcripts (default: "transcripts")
        languages: Preferred languages (default: ["en"])

    Returns:
        Dictionary with success/skip counts and paths
    """
    languages = languages or ["en"]
    success, skipped = 0, 0
    results = []

    print(f"📥 Downloading {len(video_ids)} transcript(s)...")
    print(f"📁 Output directory: {output_dir}\n")

    for i, raw in enumerate(video_ids, 1):
        # Strip full URL if pasted
        video_id = re.sub(r".*[?&]v=", "", raw).split("&")[0]
        print(f"[{i}/{len(video_ids)}] {video_id}")

        transcript = fetch_transcript(video_id, languages)
        if transcript:
            path = save_transcript(transcript, output_dir)
            print(f"  ✓ Saved: {path}")
            print(f"  📊 {len(transcript['text'])} characters, {len(transcript['segments'])} segments")
            results.append({
                "video_id": video_id,
                "status": "success",
                "path": str(path),
                "length": len(transcript['text'])
            })
            success += 1
        else:
            results.append({
                "video_id": video_id,
                "status": "failed"
            })
            skipped += 1
        print()

    print(f"✅ Done! {success} saved, {skipped} skipped")
    print(f"📂 Files saved to: {output_dir}/")

    return {
        "success": success,
        "skipped": skipped,
        "results": results,
        "output_dir": output_dir
    }


# ============================================================================
# USAGE EXAMPLE - Modify this section with your video IDs
# ============================================================================

if __name__ == "__main__":
    # Add your YouTube video IDs here (or full URLs)
    video_ids = [
        "X6AR2RMB5tE",  # Your video
        # Add more video IDs here...
    ]

    # Download transcripts
    results = download_transcripts(
        video_ids=video_ids,
        output_dir="transcripts",  # Change output folder if needed
        languages=["en"]            # Change languages if needed
    )

    # Show summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    for r in results["results"]:
        if r["status"] == "success":
            print(f"✓ {r['video_id']}: {r['length']} chars → {r['path']}")
        else:
            print(f"✗ {r['video_id']}: Failed")
