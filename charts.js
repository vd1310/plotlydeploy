function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    //console.log(data);
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
    //console.log("chartsfunctioncalled");
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
  //console.log("this is charts");
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    // variable for Bubble chart
    var sampledata = data.samples;
    var metadata = data.metadata;
      
    //console.log(sampledata);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampledata.filter(sampleObj => sampleObj.id == sample);
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    var metaresult = metadataArray[0];

    //console.log(result);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuid = result.otu_ids;
    var frequency = metaresult.wfreq;

    //console.log(otuid);

    var otulabel = result.otu_labels;
    //console.log(otulabel);

    var otusampleValues = result.sample_values;
    //console.log(otusampleValues);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    //var yticksotuidsorted = otuid.sort((a,b) =>a-b).reverse(); 
    var yticksotuidsorted = otuid.map(otuID => `OTU ${otuID}`).reverse();
    var yticks = yticksotuidsorted.slice(0,10);
    //console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: otusampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otulabel.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }
        
    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    
    // 1. Create the trace for the bubble chart.
    
    var trace1 = {
      x: otuid,
      y: otusampleValues,
      text: otulabel,
      mode: 'markers',
      marker: {
        color: otuid,
        size: otusampleValues
      }
    };
       
    var bubbleData = [trace1];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      xaxis: { title: "Otuid" },
       };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: frequency,
        title: { text: "Belly Button Biodiversity Dashboard <br> Scrubs per week", font: {size: 24} },
        
        gauge: {
          axis: { range: [null, 10], tickwidth: 2, tickcolor: frequency},
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange"},
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "darkgreen"}


          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.50,
            value: 490
          }
        }
      }
    ];
    

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 9, height: 3, margin: { t: 0, b: 0 } };

    // 6. Use Plotly to plot the gauge data and layout.

    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

   
  });
}