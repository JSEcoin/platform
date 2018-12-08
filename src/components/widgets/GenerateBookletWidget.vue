<template>
	<ButtonWidget
		v-on:click.native="generatePDFCoinBook"
		buttonTxt="Generate Booklet"
		v-bind="{
			bookletData,
			isSmall: true,
		}"/>
</template>
<script>
import moment from 'moment';
import QRious from 'qrious';
import ButtonWidget from '@/components/widgets/ButtonWidget.vue';

/**
 * @description
 * Generate Booklet Widget
 */
export default {
	name: 'GenerateBookletWidget',
	data() {
		const self = this;
		return {
			logo: new Image(),
			logoCard: new Image(),
			foldingInstructions: new Image(),
			notes: new Image(),
			accountInfo: new Image(),
			importingMobile: new Image(),
			importingDesktop: new Image(),
			coinCodeTitle: new Image(),
		};
	},
	props: {
		/**
		 * Array of coin code objects
		 */
		bookletData: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	components: {
		ButtonWidget,
	},
	created() {
		const self = this;
		let imgPath = '';
		if (self.$store.getters.whichPlatform === 'mobile') {
			imgPath = 'file:///android_asset/www/';
		}
		// load logo to stick on qr code
		self.logo.src = imgPath+'static/QR_logo3.png';
		// load logocard to stick on qr code
		self.logoCard.src = imgPath+'static/jseLogo_card2.png';
		// folding Instructions
		self.foldingInstructions.src = imgPath+'static/foldingInstructions2.png';
		self.notes.src = imgPath+'static/notes.png';
		self.accountInfo.src = imgPath+'static/accountInfo.png';
		self.importingMobile.src = imgPath+'static/importMobile.png';
		self.importingDesktop.src = imgPath+'static/importDesktop.png';
		self.coinCodeTitle.src = imgPath+'static/coinCodeTitle.png';
	},
	methods: {
		/**
		 * Parses booklet data and generates PDF Cold Storage Wallet of all users coin codes
		 *
		 * @returns nothing
		 * @public
		 */
		generatePDFCoinBook() {
			const self = this;
			const pdfContent = [];
			const pdfBody = [];
			const pdfRow = [];
			let i = 0;
			for (i; i<self.bookletData.length; i++) {
				//coin
				const coin = self.bookletData[i];
				//qrCoinCode
				const qr = new QRious({
					foregroundAlpha: 1,
					backgroundAlpha: 0,
					foreground: '#0d152c',
					size: 300,
					value: coin.coinCode,
				});
				//add JSELogo to coinCode
				const canvas = qr.canvas;
				const ctx = canvas.getContext('2d');
				const logoWidth = self.logo.width;
				const logoHeight = self.logo.height;
				const width = qr.size / 3.8;
				const height = (logoHeight / logoWidth) * width;
				const x = (qr.size / 2) - (width / 2);
				const y = (qr.size / 2) - (height / 2);
				const maskPadding = qr.size / 30;

				ctx.globalCompositeOperation = 'source-over';
				ctx.drawImage(self.logo, 0, 0, logoWidth, logoHeight, x, y, width, height);

				//calculate table cells/rows
				const numberOfCellsPerRow = 4;
				const equalTblWidths = [];
				let tblRowCells = numberOfCellsPerRow;
				while (tblRowCells-->0) {
					equalTblWidths.push('*');
				}
				const numberOfRows = 2;
				const numberOfRCellsPerPage = numberOfCellsPerRow * numberOfRows;

				//Final QR Code Img
				const qrImage = canvas.toDataURL();
				//push cell into row
				pdfRow.push(
					[
						{
							image: qrImage,
							fit: [150, 150],
							margin: [0, 40, 0, 0],
						}, {
							style: 'leftAlignHeader',
							text: 'Amount',
							bold: true,
						}, {
							style: 'leftAlign',
							text: `${coin.value} JSE`,
						}, {
							style: 'leftAlignHeader',
							text: 'Export Date',
							bold: true,
						}, {
							style: 'leftAlign',
							text: moment(coin.ts).format('DD/MM/YY HH:mm:ss'),
						}, {
							style: 'leftAlignHeader',
							text: 'Coin Code',
							bold: true,
						}, {
							style: 'leftAlignCoinCode',
							text: coin.coinCode,
						},
					],
				);
				//detect row end reached
				if (((i+1)%numberOfCellsPerRow) === 0) {
					const pdfRowContainer = pdfRow.slice();
					pdfBody.push(pdfRowContainer);
					pdfRow.length = 0;
				}
				//detect new page
				if (((i+1)%numberOfRCellsPerPage) === 0) {
					const pdfBodyContainer = pdfBody.slice();
					pdfContent.push({
						//layout: 'exampleLayout', // optional
						style: 'coinBooklet',
						pageBreak: 'after',
						table: {
							// headers are automatically repeated if the table spans over multiple pages
							// you can declare how many rows should be treated as headers
							//headerRows: 1,
							widths: equalTblWidths,
							heights: ['auto', 'auto'],
							margin: [0,0,0,0],

							body: pdfBodyContainer,
						},
					});
					pdfBody.length = 0;
				}
				//reached end of coincode list
				if ((i+1) === self.bookletData.length) {
					let emptyCells = (Math.ceil(self.bookletData.length / numberOfCellsPerRow) * numberOfCellsPerRow) - self.bookletData.length;
					if (emptyCells > 0) {
						while (emptyCells-->0) {
							pdfRow.push([]);
						}
						pdfBody.push(pdfRow);
					}

					if (((self.bookletData.length > numberOfRCellsPerPage) && (self.bookletData.length%numberOfRCellsPerPage) === 1) || (self.bookletData.length < numberOfRCellsPerPage)) {
						pdfContent.push({
							//layout: 'exampleLayout', // optional
							style: 'coinBooklet',
							pageBreak: 'after',
							table: {
								widths: equalTblWidths,
								heights: ['auto', 'auto'],
								margin: [0,0,0,0],
								body: pdfBody,
							},
						});
					}
					break;
				}
			}
			//PDF Markup
			const dd = {
				pageSize: 'A4',
				pageOrientation: 'landscape',
				pageMargins: [0,0,0,0],
				content: pdfContent,
				styles: {
					coinBooklet: {
						/*margin: [0, 5, 0, 15],*/
						alignment: 'center',
						fontSize: 8,
					},
					leftAlign: {
						alignment: 'left',
						margin: [5,0,0,0],
						fontSize: 8,
					},
					leftAlignHeader: {
						alignment: 'left',
						margin: [5,10,0,0],
						fontSize: 8,
					},
					leftAlignCoinCode: {
						alignment: 'left',
						margin: [15,10,10,10],
						fontSize: 4,
					},
				},
			};
			console.log(dd);

			//download PDF of coin codes booklet
			if (self.$store.getters.whichPlatform === 'mobile') {
				self.saveToMobile(dd);
			} else {
				pdfMake.createPdf(dd).download('JSE_CoinCode_Booklet');
			}
		},
		saveToMobile(docDefinition) {
			let binaryArray = null;
			let currentfileEntry = null;

			//error display
			function fail(error) {
				console.log(error.code);
			}

			//share file after generation
			function shareFile(filePath) {
				const options = {
					message: 'JSE Token Coin Code Booklet Attached',
					subject: 'JSE Coin Code Booklet',
					files: [filePath],
					chooserTitle: 'Pick an app',
				};

				//on success
				function onSuccess(result) {
					console.log('Share completed? ' + result.completed);
					console.log('Shared to app: ' + result.app);
				}

				//on error
				function onError(msg) {
					console.log('Sharing failed with message: ' + msg);
				}

				//init share file
				window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
			}

			//
			function gotFileWriter(writer) {
				console.log(currentfileEntry);
				writer.onwriteend = (evt) => {
					shareFile(currentfileEntry.nativeURL);
				};
				writer.onerror = function(e) {
					console.log('Failed file read: ' + e.toString());
				};
				writer.write(binaryArray);
			}

			//
			function gotFileEntry(fileEntry) {
				currentfileEntry = fileEntry;
				fileEntry.createWriter(gotFileWriter, fail);
			}

			//
			function gotFS(fs) {
   				console.log('file system open: ' + fs.name);
				const fileName = 'JSE_CoinCode_Booklet.pdf';
				fs.root.getFile(fileName, {
					create: true,
					exclusive: false,
				}, gotFileEntry, fail);
			}

			//
			pdfMake.createPdf(docDefinition).getBuffer((buffer) => {
				const utf8 = new Uint8Array(buffer);
				binaryArray = utf8.buffer;
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
			});
		},
	},
};
</script>
