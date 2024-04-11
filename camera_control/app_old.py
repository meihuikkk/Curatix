from flask import Flask, render_template, Response, jsonify, request
import cv2
import time
import os
from flask_cors import CORS, cross_origin
import numpy as np
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# OpenCV VideoCapture object
def sharpen_image(image):
    # Apply sharpening filter
    kernel = np.array([[-1, -1, -1],
                       [-1, 9, -1],
                       [-1, -1, -1]])
    sharpened_image = cv2.filter2D(image, -1, kernel)
    return sharpened_image

def capture_images(output_folder='captured_images', duration_mins=2, frame_rate=1):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Open connections to two USB webcams (use the appropriate device indices)
    cap1 = cv2.VideoCapture(0)
    cap2 = cv2.VideoCapture(1)

    # Check if the webcams are opened successfully
    if not all([cap1.isOpened(), cap2.isOpened()]):
        print("Error: Could not open one or more webcams.")
        return

    image_counter = 0  # Counter for naming the captured images
    start_time = time.time()
    end_time = start_time + duration_mins * 60  # Calculate the end time

    while time.time() < end_time:  # Continue capturing images until the end time is reached
        # Read frames from the webcams
        ret1, frame1 = cap1.read()
        ret2, frame2 = cap2.read()

        # Display frames
        cv2.imshow("Webcam 1", frame1)
        cv2.imshow("Webcam 2", frame2)

        # Control the frame rate
        elapsed_time = time.time() - start_time
        if elapsed_time >= 1 / frame_rate:
            # Save the captured images in JPEG format with highest quality
            image_name1 = f"{output_folder}/captured_image_1_{image_counter}.jpg"
            image_name2 = f"{output_folder}/captured_image_2_{image_counter}.jpg"

            # Apply sharpening to the images
            sharpened_frame1 = sharpen_image(frame1)
            sharpened_frame2 = sharpen_image(frame2)

            cv2.imwrite(image_name1, sharpened_frame1, [cv2.IMWRITE_JPEG_QUALITY, 100])
            cv2.imwrite(image_name2, sharpened_frame2, [cv2.IMWRITE_JPEG_QUALITY, 100])

            print(f"Images captured, sharpened, and saved as {image_name1}, {image_name2}")
            image_counter += 1

            # Reset the timer
            start_time = time.time()

        # Wait for a key press and break the loop if 'q' is pressed
        key = cv2.waitKey(1)
        if key == ord('q'):
            break

    # Release the webcams and close all OpenCV windows
    cap1.release()
    cap2.release()
    cv2.destroyAllWindows()

def generate_frames_0():

    cap = cv2.VideoCapture(0)

    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

def generate_frames_1():

    cap = cv2.VideoCapture(1)

    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


def generate_frames_2():

    cap = cv2.VideoCapture(2)

    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# def capture_images(output_folders=['folder1', 'folder2', 'folder3'], frame_rate=1):
#     # Creates the output folders if they don't exist or if they do remind sam to clear it before running it again
#     for folder in output_folders:
#         if not os.path.exists(folder):
#             os.makedirs(folder)
#
#     # Open connections to three USB webcams (use the appropriate device indices!!)
#     cap1 = cv2.VideoCapture(0)
#     cap2 = cv2.VideoCapture(1)
#     cap3 = cv2.VideoCapture(2)
#
#     # Check if the webcams are opened successfully if not, give up
#     if not all([cap1.isOpened(), cap2.isOpened(), cap3.isOpened()]):
#         print("Error: Could not open one or more webcams.")
#         return
#
#     image_counter = 0  # Counter for naming the captured images
#     start_time = time.time()
#
#     while TAKING_PHOTOS == True:
#         # Read frames from the webcams
#         ret1, frame1 = cap1.read()
#         ret2, frame2 = cap2.read()
#         ret3, frame3 = cap3.read()
#
#         # Check if frames are valid
#         if not all([ret1, ret2, ret3]):
#             print("Error: Failed to capture frames from one or more webcams.")
#             break
#
#         # Display frames (optional)
#         if frame1 is not None:
#             cv2.imshow("Webcam 1", frame1)
#         if frame2 is not None:
#             cv2.imshow("Webcam 2", frame2)
#         if frame3 is not None:
#             cv2.imshow("Webcam 3", frame3)
#
#         # Control the frame rate
#         elapsed_time = time.time() - start_time
#         if elapsed_time >= 1 / frame_rate:
#             # Save the captured images to different folders
#             image_name1 = f"{output_folders[0]}/captured_image_1_{image_counter}.png"
#             image_name2 = f"{output_folders[1]}/captured_image_2_{image_counter}.png"
#             image_name3 = f"{output_folders[2]}/captured_image_3_{image_counter}.png"
#
#             if frame1 is not None:
#                 cv2.imwrite(image_name1, frame1)
#             if frame2 is not None:
#                 cv2.imwrite(image_name2, frame2)
#             if frame3 is not None:
#                 cv2.imwrite(image_name3, frame3)
#
#             print(f"Images captured and saved as {image_name1}, {image_name2}, {image_name3}")
#             image_counter += 1
#
#             # Reset the timer
#             start_time = time.time()
#
#         # # Wait for a key press and break the loop if 'q' is pressed
#         # key = cv2.waitKey(1)
#         # if key == ord('q'):
#         #     break
#
#     # Release the webcams and close all OpenCV windows
#     cap1.release()
#     cap2.release()
#     cap3.release()
#     cv2.destroyAllWindows()
#
# TAKING_PHOTOS = True

@app.route('/')
@cross_origin()
def index():
    return render_template('index.html')

@app.route('/live0')
@cross_origin()
def video_feed_0():
    return Response(generate_frames_0(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/live1')
@cross_origin()
def video_feed_1():
    return Response(generate_frames_1(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/live2')
@cross_origin()
def video_feed_2():
    return Response(generate_frames_2(), mimetype='multipart/x-mixed-replace; boundary=frame')

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
