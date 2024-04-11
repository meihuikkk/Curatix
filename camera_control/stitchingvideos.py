import os
from moviepy.editor import concatenate_videoclips, VideoFileClip

def concatenate_videos(input_folder='recorded_videos', output_file='joined_video.mov'):
    # Get a list of all video files in the input folder
    video_files = [os.path.join(input_folder, f) for f in os.listdir(input_folder) if f.endswith('.mp4')]

    if not video_files:
        print("No video files found in the input folder.")
        return

    # Create VideoFileClip objects for each video file
    clips = [VideoFileClip(file) for file in video_files]

    # Concatenate the video clips
    final_clip = concatenate_videoclips(clips)

    # Write the final concatenated video to the output path
    final_clip.write_videofile(output_file, codec='libx264', fps=30, preset='ultrafast', threads=8)

    print(f"Joined video saved as: {output_file}")

if __name__ == "__main__":
    concatenate_videos()
