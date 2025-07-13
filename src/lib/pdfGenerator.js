import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

const fonts = [
	{
		file: 'DMSans-Regular.ttf',
		name: 'DM Sans',
		weight: 'normal',
	},
	{
		file: 'DMSans-Bold.ttf',
		name: 'DM Sans',
		weight: 'bold',
	},
	{
		file: 'DMMono-Regular.ttf',
		name: 'DM Mono',
		weight: 'normal',
	},
];

jsPDF.API.events.push([
	'addFonts',
	/** @this {jsPDF} */
	function () {
		for (const font of fonts) {
			const data = this.loadFile(`/assets/${font.file}`);
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
