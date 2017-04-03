function Table (placement, data) {
    this.data = data;
    console.log(this.data);

    var columns = [
        {head: 'Gene Id', cl: 'gene_id',
        html: function(row) {return row.gene_id} },
        {head: 'Locus', cl: 'locus',
        html: function(row) {return row.locus} },
        {head: 'Tet -', cl: 'value_1',
        html: function(row) {return row.value_1} },
        {head: 'Tet +', cl: 'value_2',
        html: function(row) {return row.value_2} },
        {head: 'Log2(fold change)', cl: 'log2(fold_change)',
        html: function(row) {return row['log2(fold_change)']} },
        {head: 'P value', cl: 'p_value',
        html: function(row) {return row.p_value} },
        {head: 'Q value (adj)', cl: 'q_value',
        html: function(row) {return row.q_value} }
    ]

    var table = d3.select(placement).append('table');

    table.append('thead').append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .attr('class', function(d) { return d.cl })
        .text(function(d) {return d.head});

    table.append('tbody')
        .selectAll('tr')
        .data(this.data).enter()
        .append('tr')
        .selectAll('td')
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

    $(document).ready(function() {
        table = $('table').DataTable();
    });
console.log(columns);
}
