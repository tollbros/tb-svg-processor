import { useRef, useState } from 'react'
import { Grid, Text, Input, Button } from '@geist-ui/core'

import styles from './index.module.scss';

export default function Home () {
	const [isSvgSuccessfullyProcessed, setIsSvgSuccessfullyProcessed] = useState(false);  //should be set to false, then set to true after processing success
	const [isProcessing, setIsProcessing] = useState(false); 
	const [svgFile, setSvgFile] = useState('');
	const fileInput = useRef(null);

	const svgContainer = useRef(null);

	const onFileInput = (event) => {
		setSvgFile(event.target.value);
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
			svgContainer.current.innerHTML = '';
          	const newElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); //Create a path in SVG's namespace
          	newElement.innerHTML = e.target.result;
          	svgContainer.current.appendChild(newElement.children[0]);
        };

        reader.readAsText(file);
	}

	const saveHTMLToFile = () => {
		const fileContent = svgContainer.current.children[0].outerHTML;
		const blob = new Blob([fileContent], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.download = 'processed.svg';
		link.click();
		URL.revokeObjectURL(url);
	}

	const clear = () => {
		svgContainer.current.innerHTML = '';
		setSvgFile('');
		setIsSvgSuccessfullyProcessed(false);
		setIsProcessing(false);
	}

	//DO YOUR STUFF VINCE
	const process = () => {
		setIsProcessing(true);
		setTimeout(() => {
			setIsProcessing(false);
			setIsSvgSuccessfullyProcessed(true)
		}, 3000);
	}

	return (
		<Grid.Container height="100vh" direction="column" wrap='nowrap' gap={1}>
			<Grid>
				<Text h3 className={styles.heading}>Toll Brothers SVG Processor</Text>
			</Grid>
			<Grid>
				<Input ref={fileInput} label="Select a SVG" htmlType='file' onChange={onFileInput} width='100%' value={svgFile} />
			</Grid>
			<Grid>
				<div className={styles.svgContainer} ref={svgContainer} ></div>
			</Grid>
			<Grid.Container gap={1}>
				<Grid>
					<Button auto type="success" onClick={process} loading={isProcessing} disabled={svgFile === '' || isProcessing || isSvgSuccessfullyProcessed}>Process</Button>
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