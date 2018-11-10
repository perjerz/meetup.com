fadingBubbles = function(layer, data){
    
    // the datamap instance
    var self = this,
        className = 'fadingBubble',
        defaultColor = 'orange';
    
    // bind the data
    var bubbles = layer
        .selectAll(className)
        .data(data, JSON.stringify)
    
    // append the circles
    bubbles.enter()
        .append('circle')
        .attr('class', className)
        .attr('cx', function(datum) {

            return self.latLngToXY(datum.latitude, datum.longitude)[0];

        })
        .attr('cy', function(datum) {

            return self.latLngToXY(datum.latitude, datum.longitude)[1];

        })
        .attr('r', function(){
            
            /**
             * The initial radius of the circle. 
             * we will transition this value to a larger number
             */
            return 1;
        })
        .style('fill', function(d, i) {
            
            /**
             * If a fillKey was specified in the data, and if the datamap
             * was initialized with the "fills" option, then use the color
             * of this fill key for this bubble
             */
            if (self.options.fills && d.fillKey) {

                if (self.options.fills[d.fillKey]) {
                    return self.options.fills[d.fillKey];
                }
            }
            
            // no fillKey was specified, so use the default color
            return defaultColor;

        })
        .style('stroke', function(d, i) {
            
            // same logic as the fill property
            if (self.options.fills && d.fillKey) {

                if (self.options.fills[d.fillKey]) {
                    return self.options.fills[d.fillKey];
                }
            }
            return defaultColor;
        })
        .transition()
        .duration(2000)
        .ease(Math.sqrt)
        .attr('r', function(datum) {
            
            /**
             * The size of the bubble can be controlled using the magnitude 
             * property
             */
            return datum.magnitude ? datum.magnitude * 20 : 22;
        
        })
        .style('fill-opacity', 1e-6)
        .style('stroke-opacity', 1e-6)
        .remove()

}