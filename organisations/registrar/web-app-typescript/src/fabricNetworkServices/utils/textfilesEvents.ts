
export class MyClass {

	// Here we import the File System module of node
	private fs = require('fs');

	createFile() {

		this.fs.writeFile('file.txt', 'I am cool!',  function(err: any) {
			if (err) {
				return console.error(err);
			}
			console.log('File created!');
		});
	}

	showFile() {

		this.fs.readFile('file.txt', function (err: any, data: { toString: () => string; }) {
			if (err) {
				return console.error(err);
			}
			console.log('Asynchronous read: ' + data.toString());
		});
	}
}