import sys
import yt_dlp
import whisper

def download_video_as_mp3(youtube_url, output_path):
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': output_path,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([youtube_url])

def extract_subtitles_from_video(video_path):
    model = whisper.load_model("base")
    # Transcribe the video
    result = model.transcribe(video_path + ".mp3")
    # Print the subtitles to stdout
    print(result["text"])

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <YouTube URL>")
        sys.exit(1)

    youtube_url = sys.argv[1]
    mp3_output_path = "downloaded_audio"

    # print("Downloading and converting video to MP3...")
    download_video_as_mp3(youtube_url, mp3_output_path)

    # print("Extracting subtitles from video...")
    extract_subtitles_from_video(mp3_output_path)

    # print(f"MP3 file saved to: {mp3_output_path}")
