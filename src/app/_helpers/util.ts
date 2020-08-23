export class Util {

  static formDataToJSON(formData: any): any {
    const ConvertedJSON = {};
    for (const [key, value] of formData) {
      ConvertedJSON[key] = value;
    }

    return ConvertedJSON;
  }

  static toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  static excelButton(cols: number[], header: string) {
    return {
      extend: 'excelHtml5',
      text: '<button type="button" title="xls" class="btn btn-clear btn-sm"><i\n' +
        '                class="fa fa-file-excel-o"></i> Excel\n' +
        '              </button>',
      messageTop: header,
      exportOptions: {
        columns: cols
      }
    };
  }

  static pdfButton(cols: number[], header: string) {
    return {
      extend: 'pdfHtml5',
      text: '<button type="button" title="pdf" class="btn btn-clear btn-sm"><i\n' +
        '                class="fa fa-file-pdf-o"></i> Pdf\n' +
        '              </button>',
      messageTop: header,
      exportOptions: {
        columns: cols
      }
    };
  }
}
