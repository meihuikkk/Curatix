# Usage guide

Two things need to be set up on the SAME computer: the webapp and the camera control backend Flask app

## Installation and starting

### Webapp

Install **Node 14**. Might not work on later versions of Node

Open powershell/terminal in main folder (Shift + Right click) and type:

- `npm install` (only need to do this once!)
- `npm start`

The webapp should be running at `localhost:3000` (or `127.0.0.1:3000`)

### Flask backend

Open a **separate** powershell inside `camera_control` folder containing the Flask app

Install the necessary packages:

````
pip install flask
pip install opencv-python
pip install flask-cors
pip install moviepy
````

**Ensure 2 cameras are connected before starting the Flask app.**

Start the app with `python app.py`, The Flask app is running at `localhost:5001` (or `127.0.0.1:5001`)

## Choosing cameras

We need to figure out which camera number is which. There are 4 links to check the cameras

````
127.0.0.1:5001/video_feed/0
127.0.0.1:5001/video_feed/1
127.0.0.1:5001/video_feed/2
127.0.0.1:5001/video_feed/3
````

Go through them and note down where the cameras are pointing. We will then edit the code to change the camera links accordingly

## Edit code to pick right camera

### Live streaming cams

Note the url for the two live streaming cams. 

Open the file `src/Samuel.js` in a code editor, and search for the two constants `camera1Ip` and `camera2Ip`. Change those into the correct urls. **Save and reload website.**

### Photogrammetry cams

No longer need to change manually

## Restart apps

If there is any issue, hard restart the app by pressing Ctrl + C on the powershell terminal running the app, then press Y. Rerun the app with `npm start` for webapp or `python app.py` for Flask backend
