function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var bardata = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var barresultArray = bardata.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var barResult = barresultArray[0];
    console.log(barResult);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var barIDS = barResult.otu_ids;
    var barLabels = barResult.otu_labels;
    var barValues = barResult.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var sortedValues = barValues.sort((a, b) => a.barValues - b.barValues).reverse();
    var xticks= sortedValues.slice(-10);

    var sortedLabels = barLabels.sort((a, b) => a.barValues - b.barValues).reverse();
    var labels= sortedLabels.slice(-10);

    var sortedResults = barIDS.sort((a, b) => a.barValues - b.barValues).reverse();
    var yticks= sortedResults.slice(-10);

    console.log(xticks)
    console.log(yticks)
    console.log(labels)

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: xticks,
      y: toString(yticks),
      text: labels,
      type: "bar",
      orientation: "h"
    };

    var trace = [barData]

    // // // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", trace, barLayout);

    // 1. Create the trace for the bubble chart.
      var bubbleData = {
        x: barIDS,
        y: barValues,
        text: barLabels,
        type: 'bubble',
        mode: 'markers',
        marker: {
          color:[barIDS],
          size:[barValues],
          colorscale: ['balance']
        }
      };
        var trace = [bubbleData];
    // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures per Sample",
        xlabel: "OTU ID",
        hovermode: 'text'
    };
  
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", trace, bubbleLayout); 
    });
  
};

