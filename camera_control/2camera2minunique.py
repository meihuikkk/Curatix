import cv2
import os
import time

def capture_images(output_folder='captured_images', duration_mins=2, frame_rate=1):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Set frame size to 1920x1080 pixels
    frame_width, frame_height = 1280, 720

    # Open connections to two USB webcams (use the appropriate device indices)
    cap1 = cv2.VideoCapture(0)
    cap2 = cv2.VideoCapture(1)

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
    cap1.release()
    cap2.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    capture_images(duration_mins=6, frame_rate=2)  # Set duration and frame rate accordingly

