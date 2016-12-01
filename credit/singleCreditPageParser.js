function parseDetails(link) {
    getDom(`${DOMAIN}${link}`)
        .then(dom => {
            const
                res = {},
                rows = dom('.conditions-table tr');

            rows.each((idx, row) => {
                const columns = dom(row).children('td');

                res[dom(columns[0]).text()] = (dom(columns[1]).text()).trim().replace(/(\r\n|\n|\r|\t)/g, '');
            });

            console.log(res);
        });
}