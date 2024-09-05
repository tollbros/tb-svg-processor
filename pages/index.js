import { useRef, useState, useEffect } from 'react'
import { Grid, Text, Input, Button } from '@geist-ui/core'
import Head from 'next/head'

import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import svg_processor from '../utils/svg_processor';

import styles from './index.module.scss';

export default function Home () {
	const [isSvgSuccessfullyProcessed, setIsSvgSuccessfullyProcessed] = useState(false);  //should be set to false, then set to true after processing success
	const [isProcessing, setIsProcessing] = useState(false); 
	const [svgFile, setSvgFile] = useState('');
	const [fileName, setFileName] = useState('processed-file');
	const transformComponentRef = useRef(ReactZoomPanPinchRef);

	const resetZoom = () => {
		if (transformComponentRef.current) {
			const { resetTransform } = transformComponentRef.current;
			resetTransform();
		}
	}

	const onFileInput = (event) => {

		const fullPath = event.target.value;
		const startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
		let filename = fullPath.substring(startIndex);
		if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
			filename = filename.substring(1);
			setFileName(filename);
		}

		const svgWrapper = transformComponentRef.current.instance.contentComponent;

		resetZoom();
		setSvgFile(event.target.value);
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
			svgWrapper.innerHTML = '';
          	const newElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          	newElement.innerHTML = e.target.result;
          	svgWrapper.appendChild(newElement.children[0]);
        };

        reader.readAsText(file);
	}

	const saveHTMLToFile = () => {
		const fileContent = transformComponentRef.current.instance.contentComponent.children[0].outerHTML;
		const blob = new Blob([fileContent], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;

		const processedFileName = fileName.replace('.svg', '-processed.svg');
		link.download = processedFileName; //'processed.svg';
		link.click();
		URL.revokeObjectURL(url);
	}

	const clear = () => {
		transformComponentRef.current.instance.contentComponent.innerHTML = '';
		setSvgFile('');
		setIsSvgSuccessfullyProcessed(false);
		setIsProcessing(false);
		resetZoom();
	}


	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

	const process = async () => {
		setIsProcessing(true);
		try {
			await delay(1000); // Delay for 1 second
			const success = await svg_processor();
			console.log("WAITING FOR THE LOOP");
			if (success) {
				setIsProcessing(false);
				setIsSvgSuccessfullyProcessed(true);
			} else {
				console.log("SOMETHING WENT WRONG");
			}
		} catch (error) {
			console.error("Error processing SVG:", error);
			setIsProcessing(false);
		}
	}
	
	useEffect(() => {
		//setTimeout(() => resetZoom(), 2000);
	}, [svgFile])

	return (


		<Grid.Container direction="column" wrap='nowrap' gap={1}>
			<Grid>
			<Head>
				<title>Toll Brothers SVG Processor</title>
			</Head>
				<Text h3 className={styles.heading}>Toll Brothers SVG Processor</Text>
			</Grid>
			<Grid>
				<Input label="Select a SVG" htmlType='file' onChange={onFileInput} width='100%' value={svgFile} disabled={isProcessing}/>
			</Grid>
			<Grid className={styles.svgContainer} >
				<TransformWrapper
				ref={transformComponentRef}
				centerOnInit={true}
				>
				{() => (
					<TransformComponent wrapperClass={styles.transformWrapper} contentClass={styles.transformWrapper}></TransformComponent>
				)}
				</TransformWrapper>				
			</Grid>
			<Grid.Container gap={1}>
				<Grid>
					<Button auto ghost type="success" onClick={process} loading={isProcessing} disabled={svgFile === '' || isProcessing || isSvgSuccessfullyProcessed}>Process</Button>
				</Grid>
				<Grid>
					<Button auto type="success" onClick={saveHTMLToFile} disabled={!isSvgSuccessfullyProcessed || isProcessing}>Save</Button>
				</Grid>
				<Grid>
					<Button ghost auto type="secondary" onClick={clear} disabled={svgFile === '' || isProcessing}>Clear</Button>
				</Grid>
			</Grid.Container>
		</Grid.Container>
	)
}