import React, { useMemo, useState } from 'react';
import Popup from './Popup'
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { RadioGroup, FormLabel, Radio, FormControlLabel } from '@material-ui/core'
import { useDropzone } from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';
import './ImageUpload.css';

import * as THREE from 'three';

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import saveAs from 'file-saver';
import styled from 'styled-components'

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import GetAppIcon from '@material-ui/icons/GetApp';

const scaleSize = {
    x: 0.001,
    y: 0.001,
    z: 0.001,
}


const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: "100%",
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};


const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

export default function HomePopup(props) {
    const classes = useStyles();
    const [file, setFile] = useState(null);
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);
    const [depth, setDepth] = useState(1);
    // 圆柱
    const [radiusTop, setRadiusTop] = useState(1);
    const [radius, setRadius] = useState(1);
    const [radiusBottom, setRadiusBottom] = useState(1);
    const [radialSegments, setRadialSegments] = useState(64);
    const [heightSegments, setHeightSegments] = useState(1);
    const [widthSegments, setWidthSegments] = useState(1);
    const [thetaStart, setThetaStart] = useState(0);
    const [thetaLength, setThetaLength] = useState(2 * Math.PI);
    const [sphereWidthSegments, setSphereWidthSegments] = useState(32);
    const [sphereHeightSegments, setSphereHeightSegments] = useState(16);
    const [shapeActive, setShapeActive] = useState('0')
    const handleSubmit = (event) => {
        event.preventDefault();
        if (file) {
            // loadFile(file, width, height, depth);
            loadModelFile()
        }
    };;

    const [url, setUrl] = useState("");


    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            // Here you can call loadFile or any other function to handle the file
        }
    };

    const { acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        open
    } = useDropzone({ onDrop });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    const loadFile = (file, userWidth, userHeight, userDepth) => {
        props.setOpen(false)
        const imageUrl = URL.createObjectURL(file);
        const textureLoader = new THREE.TextureLoader();
        // const texture = textureLoader.load('C:/Users/edge/Pictures/test_texture.jpg');
        textureLoader.load(
            // resource URL
            imageUrl,

            // onLoad callback
            function (texture) {
                // const material = new THREE.MeshBasicMaterial({
                //     map: texture
                // });
                // const geometry = new THREE.BoxGeometry(1, 1, 1);
                // const mesh = new THREE.Mesh(geometry, material);

                const geometry = new THREE.BoxGeometry(parseFloat(userWidth), parseFloat(userHeight), parseFloat(userDepth));

                // Define custom UV coordinates for the front face (face 4)
                // const uvMapping = [1, 0, 1, 1, 0, 1, 0, 0]; // The order is top-right, top-left, bottom-left, bottom-right

                // geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvMapping, 2));

                const materials = [
                    new THREE.MeshBasicMaterial({ color: 0xffffff }), // Right side
                    new THREE.MeshBasicMaterial({ color: 0xffffff }), // Left side
                    new THREE.MeshBasicMaterial({ color: 0xffffff }), // Top side
                    new THREE.MeshBasicMaterial({ map: texture }),   // Front side
                    new THREE.MeshBasicMaterial({ color: 0xffffff }), // Bottom side
                    new THREE.MeshBasicMaterial({ color: 0xffffff })  // Back side
                ];

                const cube = new THREE.Mesh(geometry, materials);

                const exporter = new GLTFExporter();
                exporter.parse(cube, (gltf) => {
                    // `gltf` contains the GLTF representation of your mesh

                    // You can save the GLTF data to a file using the FileSaver library or send it to a server
                    // Here's an example using FileSaver.js to save the GLTF to a file:
                    const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
                    saveAs(blob, 'your_model.gltf');
                });
            },

            // onProgress callback currently not supported
            undefined,

            // onError callback
            function (err) {
                console.error('An error happened.');
            }
        );

        // // Create a 3D box and apply the texture
        // const geometry = new THREE.BoxGeometry(1, 1, 1);
        // // const material = new THREE.MeshBasicMaterial({ map: texture });
        // const mesh = new THREE.Mesh(geometry, material);
        // // const geometry = new THREE.BoxGeometry(1, 1, 1);
        // // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // // const mesh = new THREE.Mesh(geometry, material);
        // // const serializedMesh = cube.toJSON(); 
        // const exporter = new GLTFExporter();
        // exporter.parse(mesh, (gltf) => {
        //     // `gltf` contains the GLTF representation of your mesh

        //     // You can save the GLTF data to a file using the FileSaver library or send it to a server
        //     // Here's an example using FileSaver.js to save the GLTF to a file:
        //     const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
        //     saveAs(blob, 'your_model.gltf');
        // });
    }

    const loadModelFile = () => {
        props.setOpen(false)
        console.log(file);
        const imageUrl = URL.createObjectURL(file);
        console.log(imageUrl);
        const textureLoader = new THREE.TextureLoader();
        const exporter = new GLTFExporter();
        // const material = new THREE.MeshBasicMaterial({map:file})
        textureLoader.load(
            // resource URL
            imageUrl,
            // onLoad callback
            function (texture) {
                const materials = new THREE.MeshBasicMaterial({ map: texture })
                switch (shapeActive) {
                    case '0':
                        const geometry = new THREE.BoxGeometry(parseFloat(width), parseFloat(height), parseFloat(depth));
                        geometry.scale(scaleSize.x, scaleSize.y, scaleSize.z)
                        const cube = new THREE.Mesh(geometry, materials);
                        exporter.parse(cube, (gltf) => {
                            // `gltf` contains the GLTF representation of your mesh

                            // You can save the GLTF data to a file using the FileSaver library or send it to a server
                            // Here's an example using FileSaver.js to save the GLTF to a file:
                            const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
                            saveAs(blob, 'your_model.gltf');
                        });
                        break;
                    case '1':
                        const cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, false);
                        cylinderGeometry.scale(scaleSize.x, scaleSize.y, scaleSize.z)
                        const cylinder = new THREE.Mesh(cylinderGeometry, materials);
                        exporter.parse(cylinder, (gltf) => {
                            const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
                            saveAs(blob, 'your_model.gltf');
                        });
                        break;
                    case '2':
                        const sphereGeometry = new THREE.SphereGeometry(radius, sphereWidthSegments, sphereHeightSegments);
                        sphereGeometry.scale(scaleSize.x, scaleSize.y, scaleSize.z)
                        const sphere = new THREE.Mesh(sphereGeometry, materials);
                        exporter.parse(sphere, (gltf) => {
                            const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
                            saveAs(blob, 'your_model.gltf');
                        });
                        break;
                    case '3':
                        const coneGeometry = new THREE.ConeGeometry(radius, height, radialSegments);
                        coneGeometry.scale(scaleSize.x, scaleSize.y, scaleSize.z)
                        const cone = new THREE.Mesh(coneGeometry, materials);
                        exporter.parse(cone, (gltf) => {
                            const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
                            saveAs(blob, 'your_model.gltf');
                        });
                        break;
                }
            },

            // onProgress callback currently not supported
            undefined,

            // onError callback
            function (err) {
                console.error('An error happened.');
            }
        );
    }

    const changeShape = (event) => {
        setShapeActive(event.target.value)
    }

    const rectForm = (
        <><input type="number" placeholder="Width(mm)" onChange={e => setWidth(e.target.value)} /><input type="number" placeholder="Height(mm)" onChange={e => setHeight(e.target.value)} /><input type="number" placeholder="Depth(mm)" onChange={e => setDepth(e.target.value)} /></>
    )
    const cylinderForm = (
        <><input type="number" placeholder="Height(mm)" onChange={e => setHeight(e.target.value)} /><input type="number" placeholder="RadiusTop(mm)" onChange={e => setRadiusTop(e.target.value)} /><input type="number" placeholder="RadiusBottom(mm)" onChange={e => setRadiusBottom(e.target.value)} /><input type="number" placeholder="RadialSegments" onChange={e => setRadialSegments(e.target.value)} /><input type="number" placeholder="HeightSegments" onChange={e => setHeightSegments(e.target.value)} /></>
    )
    const circularForm = (
        <><input type="number" placeholder="Height(mm)" onChange={e => setHeight(e.target.value)} /><input type="number" placeholder="Radius(mm)" onChange={e => setRadius(e.target.value)} /><input type="number" placeholder="RadialSegments" onChange={e => setRadialSegments(e.target.value)} /></>
    )
    const globeForm = (
        <><input type="number" placeholder="Radius(mm)" onChange={e => setRadius(e.target.value)} /><input type="number" placeholder="WidthSegments" onChange={e => setSphereWidthSegments(e.target.value)} /><input type="number" placeholder="HeightSegments" onChange={e => setSphereHeightSegments(e.target.value)} /></>
    )
    const renderForm = (type) => {
        switch (type) {
            case '0':
                return rectForm
            case '1':
                return cylinderForm
            case '2':
                return globeForm
            case '3':
                return circularForm
        }
    }

    const content = (
        <DialogContent className="dialogContent">
            <section className="section">
                <h2>Create a 3D Object</h2>
            </section>
            <div className='choose-group'>
                <FormLabel component="legend">Shape</FormLabel>
                &nbsp;&nbsp;
                <RadioGroup className='radio-group' aria-label="shape" name="shape" value={shapeActive} onChange={changeShape}>
                    <FormControlLabel value="0" control={<Radio />} label="Rect" />
                    <FormControlLabel value="1" control={<Radio />} label="Cylinder" />
                    <FormControlLabel value="2" control={<Radio />} label="Globe" />
                    <FormControlLabel value="3" control={<Radio />} label="Circular" />
                </RadioGroup>
            </div>
            <section className="section">
                <div className="form-container">
                    <form className='model-form' onSubmit={handleSubmit}>
                        {
                            renderForm(shapeActive)
                        }
                        <input type="file" accept='image/*' onChange={e => setFile(e.target.files[0])} />
                        <div className="button-container">
                            <button type="submit" className='button-12'>Create 3D Object</button>
                        </div>
                    </form>
                </div>
            </section>
        </DialogContent>
    );





    return (
        <Popup
            title="Upload image"
            innerContent={content}
            icon={<OpenInBrowserIcon />}
            closeText="Close"
            {...props}
        />
    )
}

