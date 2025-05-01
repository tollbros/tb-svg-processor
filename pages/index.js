import { useRef, useState, useEffect } from 'react'
import { Grid, Text, Input, Button, Checkbox } from '@geist-ui/core'
import Head from 'next/head'

import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

import svg_lot_processor from '../utils/svg_lot_processor';
import getParcel from '../utils/getParcel';

import styles from './index.module.scss';

export default function Home () {
	const [isSvgSuccessfullyProcessed, setIsSvgSuccessfullyProcessed] = useState(false);  //should be set to false, then set to true after processing success
	const [isProcessing, setIsProcessing] = useState(false); 
	const [svgFile, setSvgFile] = useState('');
	const [isDesert, setIsDesert] = useState(false);
	const [isHighrise, setIsHighrise] = useState(false);

	const highriseID = useRef(null);
	const theLotCollections = useRef(null);
	const NumberCollection  = useRef(null);
	const sqftCollection  = useRef(null);
	const floorCollection  = useRef(null);
	const parcels = useRef(null);
	const lotDimensions  = useRef(null);
	const lotCountRef = useRef(0);
    const collectionCountRef = useRef(0);

	const transformComponentRef = useRef(ReactZoomPanPinchRef);
	
	const toggleDesert = () => {
		setIsDesert(!isDesert);
	}

	const resetZoom = () => {
		if (transformComponentRef.current) {
			const { resetTransform } = transformComponentRef.current;
			resetTransform();
		}
	}

	const onFileInput = (event) => {

		const svgWrapper = transformComponentRef.current.instance.contentComponent;

		resetZoom();
		setIsSvgSuccessfullyProcessed(false);
		setIsDesert(false);
		setSvgFile(event.target.value);
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
			svgWrapper.innerHTML = '';
          	const newElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          	newElement.innerHTML = e.target.result;
          	svgWrapper.appendChild(newElement.children[0]);

			console.log("LOADED");

			//document.get by partial id of "highrise-" and then some numbers
			const highrise = document.querySelectorAll('[id^="HIGHRISE-"]');

			if (document.getElementById('LOTS')) {
				console.log("Found LOTS");
				theLotCollections.current = document.getElementById('LOTS').children;
				NumberCollection.current = document.getElementById('LOT_NUMBERS').children;
				sqftCollection.current = document.getElementById('SQUARE_FEET');
				parcels.current = document.getElementById('PARCELS');
				lotDimensions.current = document.getElementById('LOT_DIMS') || document.getElementById('LOT_DIMENSIONS');
			} else if (highrise) {
				console.log("Found HIGHRISE");
				setIsHighrise(true);
				highriseID.current = highrise[0].id.replace(/HIGHRISE-/, '');
				floorCollection.current = highrise[0].children;
			}
			console.log('haha');
		  
        };

        reader.readAsText(file);
	}

	const saveHTMLToFile = () => {
		const fileName = /([^\\]+)\\?$/.exec(svgFile)?.[1]?.replace('.svg', '-processed.svg') || 'processed.svg';
		const fileContent = transformComponentRef.current.instance.contentComponent.children[0].outerHTML;
		const blob = new Blob([fileContent], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.download = fileName;
		link.click();
		URL.revokeObjectURL(url);
	}

	const clear = () => {
		transformComponentRef.current.instance.contentComponent.innerHTML = '';
		setSvgFile('');
		setIsSvgSuccessfullyProcessed(false);
		setIsDesert(false);
		setIsProcessing(false);
		resetZoom();
	}

	const processLots = () => {

		let theLots, jde_num, numCollection;

		const lotCount = lotCountRef.current;
		const collectionCount = collectionCountRef.current;


		if (isHighrise) {
			console.log('highrise parsing');
			const theFloor = document.getElementById(floorCollection.current[collectionCount].id).children;
			const theUnitsElement = Array.from(theFloor).find(el => el.getAttribute('data-name') === "UNITS" || el.id === "UNITS");
			theLots = theUnitsElement?.children;
			const theNumbersElement = Array.from(theFloor).find(el => el.getAttribute('data-name') === "LABELS"|| el.id === "LABELS");
			numCollection = theNumbersElement?.children;
			jde_num = highriseID.current;
		} else {
			theLots = document.getElementById(theLotCollections.current[collectionCount].id).children;
			jde_num = theLotCollections.current[collectionCount].id.replace(/LOTS-/, '');
			numCollection = NumberCollection.current;
		}



		if (lotCount < theLots?.length) {
			const success = svg_lot_processor(theLots[lotCount], jde_num, numCollection, sqftCollection.current, lotDimensions.current, isHighrise);
			if (success) {
				theLots[lotCount].style.filter = "brightness(0)";
				if (parcels.current) {
					const myParcel = getParcel(theLots[lotCount], parcels.current);
					if (myParcel) {
						theLots[lotCount].setAttribute('data-parcel', myParcel.id);
					}
				}
				lotCountRef.current++;
				requestAnimationFrame(processLots); // Process the next lot
			}
			
		} else {
			lotCountRef.current = 0;
			const nextCollection = collectionCount + 1;
			const collectionLength = isHighrise ? floorCollection.current.length : theLotCollections.current.length;
			if (nextCollection < collectionLength) {
				collectionCountRef.current = nextCollection;
				requestAnimationFrame(processLots); // Move to the next collection
			} else {
				document.querySelectorAll('[style*="brightness(0)"]').forEach((el) => {
					el.style.filter = "";
				});
				setIsSvgSuccessfullyProcessed(true);
				setIsProcessing(false);
			}
		}

    };



	const process = async () => {
		setIsProcessing(true);
		if (isDesert) {
			const theSVG = document.querySelector('svg');
			theSVG.setAttribute('data-terrain', "desert");
		}
		if (isHighrise) {
			const theSVG = document.querySelector('svg');
			theSVG.setAttribute('data-highrise', "true");
		}
		lotCountRef.current = 0;
		collectionCountRef.current = 0;
		requestAnimationFrame(processLots);
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
				<Input label="Select a SVG" htmlType='file' onChange={onFileInput} width='100%' value={svgFile} disabled={isProcessing} accept=".svg"/>
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
				<Grid className={styles.checkboxy}>
					<Checkbox checked={isDesert} onChange={toggleDesert} disabled={svgFile === '' || isProcessing || isSvgSuccessfullyProcessed}>Set Terrain To Desert</Checkbox>
				</Grid>
			</Grid.Container>
		</Grid.Container>
	)
}