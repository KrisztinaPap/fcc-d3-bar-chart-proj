// Set variables

let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let req = new XMLHttpRequest()

let data
let values

let heightScale
let xScale
let xAxisScale
let yAxisScale

let width = 800
let height = 600
let padding = 40

let svg = d3.select('svg')

// Set functions

// Draw canvas

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

// Generate scales

let generateScales = () => {
    heightScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) => {
                        return item[1]
                    })])
                    .range([0, height - (2 * padding)])

    xScale = d3.scaleLinear()
                    .domain([0, values.length - 1])
                    .range([padding, width - padding])

    let datesArray = values.map((item) => {
        return new Date(item[0])
    })    
    
    xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray), d3.max(datesArray)])
                    .range([padding, width - padding])

    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) => {
                        return item[1]
                    })])
                    .range([height - padding, padding])
}

// Draw bars and add mouse over effect

let drawBars = () => {

    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('visibility', 'hidden')
                    .style('width', 'auto')
                    .style('height', 'auto')

    svg.selectAll("rect")
        .data(values)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("width", (width - (2 * padding)) / values.length)
        .attr("data-date", (item) => {
            return item[0]
        })        
        .attr("data-gdp", (item) => {
            return item[1]
        })
        .attr("height", (item) => {
            return heightScale(item[1])
        })
        .attr("x", (item, i) => {
            return xScale(i)
        })
        .attr("y", (item) => {
            return (height - padding) - heightScale(item[1])
        })
        .attr('fill', 'blue')
        .on('mouseover', (item) => {
            tooltip.transition()
                .style('visibility', 'visible')
            
            tooltip.text("Date: " + item[0] + ", GDP: $" + item[1] + " Billion")

            document.querySelector('#tooltip').setAttribute('data-date', item[0]) 
        })

        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
}

// Generate the axes

let generateAxes = () => {
    
    let xAxis = d3.axisBottom(xAxisScale)

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')

    let yAxis = d3.axisLeft(yAxisScale)

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
}

// Set up JSON API and call functions

req.open('GET', url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    values = data.data
    console.log(values)
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
}
req.send()