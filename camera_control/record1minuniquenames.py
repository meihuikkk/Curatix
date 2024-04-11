import cv2
import os
import time

def record_videos(output_folder='recorded_videos', duration_secs=30, resolution=(1920, 1080), frame_rate=60):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Set up video writers for both cameras
    codec = cv2.VideoWriter_fourcc(*'mp4v')  # Use MP4V codec for MP4 format
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    video_name_1 = os.path.join(output_folder, f"video_1_{timestamp}.mp4")
    video_name_2 = os.path.join(output_folder, f"video_2_{timestamp}.mp4")
    
    # Open connections to the webcams (0 and 1 are usually the default webcams)
    cap1 = cv2.VideoCapture(0)
    cap2 = cv2.VideoCapture(1)

    # Check if the webcams are opened successfully
    if not cap1.isOpened() or not cap2.isOpened():
        print("Error: Could not open one or both webcams.")
        return

    # Set the resolution for both cameras
    cap1.set(cv2.CAP_PROP_FRAME_WIDTH, resolution[0])
    cap1.set(cv2.CAP_PROP_FRAME_HEIGHT, resolution[1])
    cap2.set(cv2.CAP_PROP_FRAME_WIDTH, resolution[0])
    cap2.set(cv2.CAP_PROP_FRAME_HEIGHT, resolution[1])

    # Define the frame width and height
    frame_width = int(cap1.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap1.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Create VideoWriter objects to save the videos
    out1 = cv2.VideoWriter(video_name_1, codec, frame_rate, (frame_width, frame_height))
    out2 = cv2.VideoWriter(video_name_2, codec, frame_rate, (frame_width, frame_height))

    # Record for the specified duration
    start_time = time.time()
    while (time.time() - start_time) < duration_secs:
        # Read frames from the webcams
        ret1, frame1 = cap1.read()
        ret2, frame2 = cap2.read()

        # Check if the frames were successfully read
        if not ret1 or not ret2:
            print("Error: Couldn't read frames from one or both webcams.")
            break

        # Write the frames to the video files
        out1.write(frame1)
        out2.write(frame2)

        # Display the captured frames (optional)
        cv2.imshow("Webcam 1", frame1)
        cv2.imshow("Webcam 2", frame2)

        # Break the loop if 'q' key is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the webcams and VideoWriter objects
    cap1.release()
    cap2.release()
    out1.release()
    out2.release()
    cv2.destroyAllWindows()

    print(f"Videos recorded successfully: {video_name_1} and {video_name_2}")

if __name__ == "__main__":
    # Record videos from two cameras for 60 seconds
    record_videos(duration_secs=60)
