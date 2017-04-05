function Table (placement, data) {
//    this.updateTable(data);
    //this.data = data;

    //this.update = function(data) {
    //}
        

    var columns = [
        {head: 'Gene Id', cl: 'text',
        html: function(row) {return row.gene_id} },
        {head: 'Locus', cl: 'text',
        html: function(row) {return row.locus} },
        {head: 'Tet -', cl: 'numeric',
        html: function(row) {return row.value_1} },
        {head: 'Tet +', cl: 'numeric',
        html: function(row) {return row.value_2} },
        {head: 'Log2(fold change)', cl: 'numeric',
        html: function(row) {return row['log2(fold_change)']} },
        {head: 'P value', cl: 'numeric',
        html: function(row) {return row.p_value} },
        {head: 'Q value (adj)', cl: 'numeric',
        html: function(row) {return row.q_value} }
    ]

    this.table = d3.select(placement).append('table');

    this.table.append('thead').append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .attr('class', 'title')
        .text(function(d) {return d.head});

    this.tableBody = this.table.append('tbody');

    this.updateTable = function(data) {
        //this.table.append('tbody')
            var row = this.tableBody.selectAll('tr')
            .data(data).enter()
            .append('tr');
            row.exit().remove();

            var cell = row.selectAll('td')
            .data(function(row, i) {
                return columns.map(function(c) {
                    var cell = {};
                    d3.keys(c).forEach(function(k) {
                        cell[k] = typeof c[k] == 'function' ? c[k](row, i) : c[k];
                    });
                    return cell;
                });
            }).enter()
            .append('td')
            .html (function(d) { return d.html })
            .attr('class', function(d) { return d.cl });
            cell.exit().remove()
            this.table = $('table').DataTable();
    }

    this.updateTable(data);

   /* $(document).ready(function() {
        this.table = $('table').DataTable();
    }); */

}
