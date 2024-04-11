import cv2
import os
import time
import numpy as np  # Import NumPy library for array operations

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

if __name__ == "__main__":
    capture_images(duration_mins=2, frame_rate=2)  # Set duration and frame rate accordingly
