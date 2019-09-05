<template>
	<ButtonWidget  v-if="!autoGenerate"
		style="position:relative"
		v-on:click.native="generatePDFCoinPage"
		:buttonTxt="buttonTxt"
		:loading="loading" />
</template>
<script>
import moment from 'moment';
import QRious from 'qrious';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import ButtonWidget from '@/components/widgets/ButtonWidget.vue';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

/**
 * @description
 * Generate Coin Page Widget
 */
export default {
	name: 'GenerateCoinPageWidget',
	inheritAttrs: false,
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
			loading: false,
		};
	},
	props: {
		/**
		 * Object of coin data
		 */
		coinData: {
			type: Object,
			default() {
				return {};
			},
		},
		/**
		 * text to display on button ['Print Code', 'Paper Download']
		 */
		buttonTxt: {
			type: String,
			default: 'Print Code',
		},
		/**
		 * Autogenerate coin code
		 */
		autoGenerate: {
			type: Boolean,
			default: false,
		},
	},
	watch: {
		coinData(update) {
			const self = this;
			console.log(update);
			if (self.autoGenerate) {
				self.generatePDFCoinPage();
			}
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
		} else if (self.$store.getters.whichPlatform === 'web') {
			imgPath = '/';
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
		 * Generates a base64 img
		 *
		 * @param {Object} img - preloading image reference
		 * @param {Boolean} rotate - Flip image 180deg
		 * @returns Base64 Img
		 * @public
		 */
		generateB64Img(img, rotate) {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.height = img.naturalHeight;
			canvas.width = img.naturalWidth;
			// Move registration point to the center of the canvas
			if (rotate) {
				ctx.translate(canvas.width/2, canvas.height/2);
				// Rotate 1 degree
				ctx.rotate((180 * Math.PI) / 180);
				ctx.translate(-canvas.width/2, -canvas.height/2);
			}

			ctx.drawImage(img, 0, 0);
			const b64 = canvas.toDataURL('image/png');

			return b64;
		},
		/**
		 * Generates a single PDF cold storage coin wallet page
		 *
		 * @param {Object} e - click event
		 * @returns nothing
		 * @public
		 */
		generatePDFCoinPage(e) {
			const self = this;
			if (typeof (e) !== 'undefined') {
				e.preventDefault();
				e.stopPropagation();
			}
			self.loading = true;

			const jseB64Logo = self.generateB64Img(self.logoCard, true);
			const foldingInstructions = self.generateB64Img(self.foldingInstructions, true);
			const importingMobile = self.generateB64Img(self.importingMobile, false);
			const importingDesktop = self.generateB64Img(self.importingDesktop, false);
			const notes = self.generateB64Img(self.notes, false);
			const coinCodeTitle = self.generateB64Img(self.coinCodeTitle, false);
			const accountInfo = self.generateB64Img(self.accountInfo, true);

			const coin = self.coinData;
			console.log('coin', coin);
			const qr = new QRious({
				foregroundAlpha: 1,
				backgroundAlpha: 0,
				foreground: '#0d152c',
				size: 300,
				value: coin.coinCode,
			});
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

			const qrImage = canvas.toDataURL();

			const numberOfCellsPerRow = 4;
			const equalTblWidths = [];
			let tblRowCells = numberOfCellsPerRow;
			while (tblRowCells-->0) {
				equalTblWidths.push('*');
			}
			const numberOfRows = 2;
			const numberOfRCellsPerPage = numberOfCellsPerRow * numberOfRows;
			//PDF Markup
			const dd = {
				pageOrientation: 'landscape',
				pageMargins: [0,0,0,0],
				content: {
					style: 'coinCodesBooklet',
					table: {
						// headers are automatically repeated if the table spans over multiple pages
						// you can declare how many rows should be treated as headers
						//headerRows: 1,
						widths: equalTblWidths,
						heights: [292, 292],
						margin: [0,0,0,0],

						body: [
							//row1
							[
								[{
									image: jseB64Logo,
									fit: [280, 200],
									margin: [0, 30, 0, 0],
								}],
								[],
								[{
									image: foldingInstructions,
									fit: [280, 225],
									margin: [0, 55, 0, 0],
								}],
								[{
									image: accountInfo,
									fit: [280, 225],
									margin: [0, 55, 0, 0],
								}],
							],
							//row2
							[
								[{
									image: coinCodeTitle,
									fit: [200, 29],
									margin: [0, 10, 0, 0],
								},{
									image: qrImage,
									fit: [150, 150],
									margin: [0, 10, 0, 0],
								},{
									text: coin.coinCode,
									style: 'coinCode',
								},{
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
								}],
								[{
									image: notes,
									fit: [280, 225],
									margin: [0, 10, 0, 0],
								}],
								[{
									image: importingDesktop,
									fit: [280, 225],
									margin: [0, 10, 0, 0],
								}],
								[{
									image: importingMobile,
									fit: [280, 225],
									margin: [0, 10, 0, 0],
								}],
							],
						],
						pageBreak: 'after',
					},
				},
				styles: {
					coinCodesBooklet: {
						/*margin: [0, 5, 0, 15],*/
						alignment: 'center',
						fontSize: 8,
					},
					leftAlign: {
						alignment: 'left',
						margin: [10,5,0,0],
						fontSize: 8,
					},
					leftAlignHeader: {
						alignment: 'left',
						margin: [10,10,0,0],
						fontSize: 8,
					},
					coinCode: {
						alignment: 'center',
						margin: [0,10,0,0],
						fontSize: 4,
					},
				},
			};

			//download PDF of coin codes booklet
			if (self.$store.getters.whichPlatform === 'mobile') {
				self.saveToMobile(dd);
			} else {
				//download PDF of coin codes
				pdfMake.createPdf(dd).download('JSE_CoinCode',() => {
					//after download hide loading anim
					self.stopLoading();
				});
			}
		},
		saveToMobile(docDefinition) {
			const self = this;
			let binaryArray = null;
			let currentfileEntry = null;

			//error display
			function fail(error) {
				console.log(error.code);
			}

			//share file after generation
			function shareFile(filePath) {
				const options = {
					message: 'JSE Token Coin Code Attached',
					subject: 'JSE Coin Code',
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

				//remove loading gif on button
				self.stopLoading();

				//init share file
				window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
			}

			//
			function gotFileWriter(writer) {
				//console.log(currentfileEntry);
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
   				//console.log('file system open: ' + fs.name);
				const fileName = 'JSE_CoinCode.pdf';
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
		stopLoading() {
			const self = this;
			self.loading = false;
			if (self.$swal) {
				self.$swal.stopLoading();
			}
		},
	},
};
</script>
