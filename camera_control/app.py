import threading

from flask import Flask, render_template, Response, jsonify, request, redirect, url_for
import cv2
import time
import os
from flask_cors import CORS, cross_origin
import numpy as np
from moviepy.editor import concatenate_videoclips, VideoFileClip
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

camera_threads = {}

cam1 = None
cam2 = None

rotate_cams_var = False

# cameras = [cv2.VideoCapture(0), cv2.VideoCapture(1), cv2.VideoCapture(2)]

# for cap in cameras:
#     cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
#     cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

# # Change this to the correct cams for photogrammetry
# cap1 = cameras[0]
# cap2 = cameras[1]

# OpenCV VideoCapture object
def sharpen_image(image):
    # Apply sharpening filter
    kernel = np.array([[-1, -1, -1],
                       [-1, 9, -1],
                       [-1, -1, -1]])
    sharpened_image = cv2.filter2D(image, -1, kernel)
    return sharpened_image


def capture_images(output_folder='captured_images', cap1_index=0, cap2_index=1, duration_mins=4, frame_rate=1):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Set frame size to 1920x1080 pixels
    frame_width, frame_height = 1280, 720
    cap1 = cv2.VideoCapture(cap1_index)
    cap2 = cv2.VideoCapture(cap2_index)


    # Check if the webcams are opened successfully
    if not all([cap1.isOpened(), cap2.isOpened()]):
        print("Error: Could not open one or more webcams.")
        return

    # Set frame size for both webcams
    cap1.set(cv2.CAP_PROP_FRAME_WIDTH, frame_width)
    cap1.set(cv2.CAP_PROP_FRAME_HEIGHT, frame_height)
    cap2.set(cv2.CAP_PROP_FRAME_WIDTH, frame_width)
    cap2.set(cv2.CAP_PROP_FRAME_HEIGHT, frame_height)

    image_counter = 0  # Counter for naming the captured images
    start_time = time.time()
    end_time = start_time + duration_mins * 60  # Calculate the end time

    while time.time() < end_time:  # Continue capturing images until the end time is reached
        # Read frames from the webcams
        ret1, frame1 = cap1.read()
        ret2, frame2 = cap2.read()
        global rotate_cams_var
        if rotate_cams_var:
            frame1 = cv2.rotate(frame1, cv2.ROTATE_180)
            frame2 = cv2.rotate(frame2, cv2.ROTATE_180)

        # Display frames
        cv2.imshow("Webcam 1", frame1)
        cv2.imshow("Webcam 2", frame2)

        # Control the frame rate
        elapsed_time = time.time() - start_time
        if elapsed_time >= 1 / frame_rate:
            # Generate unique file names with timestamps
            timestamp = time.strftime("%Y%m%d-%H%M%S")
            image_name1 = f"{output_folder}/captured_image_1_{timestamp}_{image_counter}.png"
            image_name2 = f"{output_folder}/captured_image_2_{timestamp}_{image_counter}.png"

            cv2.imwrite(image_name1, frame1, [cv2.IMWRITE_PNG_COMPRESSION, 9])
            cv2.imwrite(image_name2, frame2, [cv2.IMWRITE_PNG_COMPRESSION, 9])

            print(f"Images captured and saved as {image_name1}, {image_name2}")
            image_counter += 1

            # Reset the timer
            start_time = time.time()

        # Wait for a key press and break the loop if 'q' is pressed
        key = cv2.waitKey(1)
        if key == ord('q'):
            break

    # Release the webcams and close all OpenCV windows
    # cap1.release()
    # cap2.release()
    cv2.destroyAllWindows()

# def capture_images(output_folder='captured_images', duration_mins=2, frame_rate=1):
#     # Create the output folder if it doesn't exist
#     if not os.path.exists(output_folder):
#         os.makedirs(output_folder)

#     # Open connections to two USB webcams (use the appropriate device indices)
#     cap1 = cameras[0]
#     cap2 = cameras[2]

#     # Check if the webcams are opened successfully
#     if not all([cap1.isOpened(), cap2.isOpened()]):
#         print("Error: Could not open one or more webcams.")
#         return

#     image_counter = 0  # Counter for naming the captured images
#     start_time = time.time()
#     end_time = start_time + duration_mins * 60  # Calculate the end time

#     while time.time() < end_time:  # Continue capturing images until the end time is reached
#         # Read frames from the webcams
#         ret1, frame1 = cap1.read()
#         ret2, frame2 = cap2.read()

#         # Display frames
#         cv2.imshow("Webcam 1", frame1)
#         cv2.imshow("Webcam 2", frame2)

#         # Control the frame rate
#         elapsed_time = time.time() - start_time
#         if elapsed_time >= 1 / frame_rate:
#             # Save the captured images in JPEG format with highest quality
#             image_name1 = f"{output_folder}/captured_image_1_{image_counter}.jpg"
#             image_name2 = f"{output_folder}/captured_image_2_{image_counter}.jpg"

#             # Apply sharpening to the images
#             sharpened_frame1 = sharpen_image(frame1)
#             sharpened_frame2 = sharpen_image(frame2)

#             cv2.imwrite(image_name1, sharpened_frame1, [cv2.IMWRITE_JPEG_QUALITY, 100])
#             cv2.imwrite(image_name2, sharpened_frame2, [cv2.IMWRITE_JPEG_QUALITY, 100])

#             print(f"Images captured, sharpened, and saved as {image_name1}, {image_name2}")
#             image_counter += 1

#             # Reset the timer
#             start_time = time.time()

#         # Wait for a key press and break the loop if 'q' is pressed
#         key = cv2.waitKey(1)
#         if key == ord('q'):
#             break

#     # Release the webcams and close all OpenCV windows
#     # cap1.release()
#     # cap2.release()
#     cv2.destroyAllWindows()

def record_videos(output_folder='recorded_videos', cap1_index=0, cap2_index=1, duration_secs=120, resolution=(1920, 1080), frame_rate=30):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Set up video writers for both cameras
    print('setting up ')
    codec = cv2.VideoWriter_fourcc(*'mp4v')  # Use MP4V codec for MP4 format
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    video_name_1 = os.path.join(output_folder, f"video_1_{timestamp}.mp4")
    video_name_2 = os.path.join(output_folder, f"video_2_{timestamp}.mp4")
    
    # Open connections to the webcams (0 and 1 are usually the default webcams)
    print('acquiring cam')
    cap1 = cv2.VideoCapture(cap1_index)
    cap2 = cv2.VideoCapture(cap2_index)

    # Check if the webcams are opened successfully
    if not cap1.isOpened() or not cap2.isOpened():
        print("Error: Could not open one or both webcams.")
        return

    # Set the resolution for both cameras
    print('set resolution')
    cap1.set(cv2.CAP_PROP_FRAME_WIDTH, resolution[0])
    cap1.set(cv2.CAP_PROP_FRAME_HEIGHT, resolution[1])
    cap2.set(cv2.CAP_PROP_FRAME_WIDTH, resolution[0])
    cap2.set(cv2.CAP_PROP_FRAME_HEIGHT, resolution[1])

    # Define the frame width and height
    frame_width = int(cap1.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap1.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Create VideoWriter objects to save the videos
    print('videowriter')
    out1 = cv2.VideoWriter(video_name_1, codec, frame_rate, (frame_width, frame_height))
    out2 = cv2.VideoWriter(video_name_2, codec, frame_rate, (frame_width, frame_height))

    # Record for the specified duration
    start_time = time.time()
    print('start ' + str(start_time))
    while (time.time() - start_time) < duration_secs:
        # cv2.waitKey(1000//frame_rate)
        # Read frames from the webcams
        ret1, frame1 = cap1.read()
        ret2, frame2 = cap2.read()
        global rotate_cams_var
        if rotate_cams_var:
            frame1 = cv2.rotate(frame1, cv2.ROTATE_180)
            frame2 = cv2.rotate(frame2, cv2.ROTATE_180)

        # Check if the frames were successfully read
        if not ret1 or not ret2:
            print("Error: Couldn't read frames from one or both webcams.")
            break

        # Write the frames to the video files
        # print("write frame")
        out1.write(frame1)
        out2.write(frame2)

        # Display the captured frames (optional)
        cv2.imshow("Webcam 1", frame1)
        cv2.imshow("Webcam 2", frame2)

        # # Break the loop if 'q' key is pressed
        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     break

    # Release the webcams and VideoWriter objects
    print("done " + str(time.time()))
    cap1.release()
    cap2.release()
    out1.release()
    out2.release()
    cv2.destroyAllWindows()

    print(f"Videos recorded successfully: {video_name_1} and {video_name_2}")


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

def generate_frames(camera_index):
    cap = cv2.VideoCapture(camera_index)

    while True:
        success, frame = cap.read()
        global rotate_cams_var

        if rotate_cams_var:
            frame = cv2.rotate(frame, cv2.ROTATE_180)

        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/')
def index():
    # # restart the cams
    # global cameras
    # cameras = [cv2.VideoCapture(0), cv2.VideoCapture(1), cv2.VideoCapture(2)]


    return render_template('index.html')  # Render the HTML template

@app.route('/video_feed/<int:cam_id>')
def video_feed(cam_id):
    return Response(generate_frames(cam_id), mimetype='multipart/x-mixed-replace; boundary=frame')

# def start_frame_generation(cam_id):
#     with app.app_context():
#         camera_threads[cam_id] = threading.Thread(target=generate_frames, args=(cam_id,))
#         camera_threads[cam_id].start()
#
# @app.route('/video_feed/<int:cam_id>')
# def video_feed(cam_id):
#     if cam_id not in camera_threads or not camera_threads[cam_id].is_alive():
#         start_frame_generation(cam_id)
#     return Response(generate_frames(cam_id), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/capture_img', methods=['POST'])
# @cross_origin()
def capture_img():
    seleted_cams = request.json.get('selected')
    global cam1
    global cam2
    cam1, cam2 = int(seleted_cams[0]), int(seleted_cams[1])

    # thread = threading.Thread(target=capture_images, args=('captured_images', cam1, cam2, 2, 2))
    # thread.start()

    return 'Capture started', 200

@app.route('/capture_vid', methods=['POST'])
# @cross_origin()
def capture_vid():
    seleted_cams = request.json.get('selected')
    global cam1
    global cam2
    cam1, cam2 = int(seleted_cams[0]), int(seleted_cams[1])

    
    # record_videos()

    return 'Capture started', 200

@app.route('/concat_vids', methods=['GET'])
# @cross_origin()
def concat_vids():

    # thread = threading.Thread(target=concatenate_videos)
    # thread.start()
    concatenate_videos()

    return 'Capture started', 200

@app.route('/recording_vids')
def recording_vids():
    thread = threading.Thread(target=record_videos, args=('recorded_videos', cam1, cam2, 120, (1920, 1080), 30))
    # thread = threading.Thread(target=record_videos)
    thread.start()
    
    return render_template('recording_vids.html')

@app.route('/recording_img')
def recording_img():
    thread = threading.Thread(target=capture_images, args=('captured_images', cam1, cam2, 4, 2))
    thread.start()
    return render_template('recording_img.html')

# flip the cams

@app.route('/rotate_cams', methods=['GET'])
@cross_origin()
def rotate_cams():
    global rotate_cams_var
    if rotate_cams_var == True:
        rotate_cams_var = False
    else:
        rotate_cams_var = True

    return 'hello', 200
    
@app.route('/start_capture', methods=['GET'])
@cross_origin()
def start_capture():
    # global TAKING_PHOTOS
    # TAKING_PHOTOS = True
    capture_images(duration_mins=2, frame_rate=2)
    return 'Capture started', 200

@app.route('/stop_capture', methods=['GET'])
@cross_origin()
def stop_capture():
    # global TAKING_PHOTOS
    # TAKING_PHOTOS = False
    return 'Not doing anything', 200

if __name__ == "__main__":
    app.run(debug=True, port=5001)
