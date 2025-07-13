import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

import dmSansRegular from '../assets/DmSans-Regular.ttf?url';
import dmSansBold from '../assets/DmSans-Bold.ttf?url';
import dmMonoRegular from '../assets/DmMono-Regular.ttf?url';

const fonts = [
	{
		file: 'DmSans-Regular.ttf',
		name: 'DM Sans',
		url: dmSansRegular,
		weight: 'normal',
	},
	{
		file: 'DmSans-Bold.ttf',
		name: 'DM Sans',
		url: dmSansBold,
		weight: 'bold',
	},
	{
		file: 'DmMono-Regular.ttf',
		name: 'DM Mono',
		url: dmMonoRegular,
		weight: 'normal',
	},
];

jsPDF.API.events.push([
	'addFonts',
	function () {
		for (const font of fonts) {
			const data = this.loadFile(font.url);
			this.addFileToVFS(font.file, data);
			this.addFont(font.file, font.name, font.weight);
		}
	},
]);

/** @param {SVGSVGElement[]} svgs */
export async function generatePDF(svgs) {
	const doc = new jsPDF({
		unit: 'pt',
		putOnlyUsedFonts: true,
	});
	doc.deletePage(1);

	for (const svg of svgs) {
		const svgWidth = svg.width.baseVal.value;
		const svgHeight = svg.height.baseVal.value;

		doc.addPage([svgWidth, svgHeight], svgWidth > svgHeight ? 'l' : 'p');
		await doc.svg(svg, {
			width: svgWidth,
			height: svgHeight,
		});
	}

	const url = doc.output('bloburl').toString();
	return url;
}
