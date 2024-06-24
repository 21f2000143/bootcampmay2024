
const ReportCompo = Vue.component('ReportCompo', {
  template: `
  <div class="container mt-5">
      <h2 class="text-center mb-4">Report</h2>
  
      <div class="text-center">
        <button class="btn btn-primary" @click="viewCSV">View</button>
        <button class="btn btn-success" @click="downloadCSV">Download</button>
      </div>
  
      <div class="mt-4" v-if="csvTableVisible">
        <h4 class="text-center">Content</h4>
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th v-for="header in csvHeaders" :key="header">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in csvData" :key="index">
              <td>{{ row.name }}</td>
              <td>{{ row.quantity }}</td>
              <td>{{ row.manufacture }}</td>
              <td>{{ row.expiry }}</td>
              <td>{{ row.rpu }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
  `,
  data() {
    return {
      csvTableVisible: false,
      csvHeaders: [], // Replace with your actual data
      csvData: [], // Replace with your actual data
    };
  },
  methods: {
    viewCSV() {
      fetch('http://127.0.0.1:5000/get/report/data')
        .then(response => response.json())
        .then(data => {
          this.csvHeaders = data.header,
          this.csvData = data.content
          this.csvTableVisible = true;
        })
        .catch(error => console.error('Error fetching CSV file:', error));
    },
    downloadCSV() {
    fetch('http://127.0.0.1:5000/get/report/download')
      .then(response => response.text())
      .then(csvData => {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'report.csv';
        link.click();
      })
      .catch(error => {
        console.error('Error fetching CSV file:', error);
      });
    }
  }
});

export default ReportCompo; 