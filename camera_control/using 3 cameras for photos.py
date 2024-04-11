# before running the code for actually capturing photos, check which camera is which
import cv2
import time
import os

def capture_images(output_folder='captured_images', frame_rate=1):
    # Creates the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Opens a connection to the USB webcam (remember to use the appropriate device index!!! e.g., 0 or 1)
    cap = cv2.VideoCapture(2)

    import cv2
import time
import os

def capture_images(output_folders=['folder1', 'folder2', 'folder3'], frame_rate=1):
    # Creates the output folders if they don't exist or if they do remind sam to clear it before running it again
    for folder in output_folders:
        if not os.path.exists(folder):
            os.makedirs(folder)

    # Open connections to three USB webcams (use the appropriate device indices!!)
    cap1 = cv2.VideoCapture(0)
    cap2 = cv2.VideoCapture(1)
    cap3 = cv2.VideoCapture(2)

    # Check if the webcams are opened successfully if not, give up
    if not all([cap1.isOpened(), cap2.isOpened(), cap3.isOpened()]):
        print("Error: Could not open one or more webcams.")
        return

    image_counter = 0  # Counter for naming the captured images
    start_time = time.time()

    while True:
        # Read frames from the webcams
        ret1, frame1 = cap1.read()
        ret2, frame2 = cap2.read()
        ret3, frame3 = cap3.read()

        # Check if frames are valid
        if not all([ret1, ret2, ret3]):
            print("Error: Failed to capture frames from one or more webcams.")
            break

        # Display frames (optional)
        if frame1 is not None:
            cv2.imshow("Webcam 1", frame1)
        if frame2 is not None:
            cv2.imshow("Webcam 2", frame2)
        if frame3 is not None:
            cv2.imshow("Webcam 3", frame3)

        # Control the frame rate
        elapsed_time = time.time() - start_time
        if elapsed_time >= 1 / frame_rate:
            # Save the captured images to different folders
            image_name1 = f"{output_folders[0]}/captured_image_1_{image_counter}.png"
            image_name2 = f"{output_folders[1]}/captured_image_2_{image_counter}.png"
            image_name3 = f"{output_folders[2]}/captured_image_3_{image_counter}.png"

            if frame1 is not None:
                cv2.imwrite(image_name1, frame1)
            if frame2 is not None:
                cv2.imwrite(image_name2, frame2)
            if frame3 is not None:
                cv2.imwrite(image_name3, frame3)

            print(f"Images captured and saved as {image_name1}, {image_name2}, {image_name3}")
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
    cap3.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    capture_images(frame_rate=2)  # Setting frame rate (frames per second)



