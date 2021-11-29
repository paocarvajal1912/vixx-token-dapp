// const sortMeta = (data) => {
//     return document.getElementsByName(data)[0].content.split("//s");
// }

// const subAddress = (addr, hash_type) => {
//     // Valid hash_type values are "tx", "address"
//     return `<a href="https://kovan.etherscan.io/${hash_type}/${addr}" target="_blank">${addr.substring(0, 5)}...${addr.substring(addr.length-4, addr.length)}</a>`
// }

// const setTableHeader = (tr, hdr) => {
//     let th = tr.insertCell();
//     th.innerHTML = `<b>${hdr}</b>`;
// }

// const setTableData = (tr, data) => {
//     let td = tr.insertCell();
//     td.width = "90px";

//     td.innerHTML = data;
// }

// const tx_hash            = sortMeta('tx_hash');
// const tx_contractAddress = sortMeta('tx_contractAddress');
// const tx_from            = sortMeta('tx_from');
// const tx_to              = sortMeta('tx_to');
// const tx_value           = sortMeta('tx_value');
// const tx_gasUsed         = sortMeta('tx_gasUsed');
// const tx_date            = sortMeta('tx_date');
// const tx_time            = sortMeta('tx_time');

// const getTransactionTable = () => {
//     let tbl  = document.createElement('table');
//     tbl.id = "table-transaction-list"
//     tbl.style.width  = '950px';

//     let header = tbl.createTHead();
//     let tr = header.insertRow(0);

//     setTableHeader(tr, "Transaction")
//     setTableHeader(tr, "Date");
//     setTableHeader(tr, "Time");
//     setTableHeader(tr, "Contract");
//     setTableHeader(tr, "From");
//     setTableHeader(tr, "To");
//     setTableHeader(tr, "Amount (wei)");

//     for(let i = 0; i < tx_from.length; i++){
//         tr = tbl.insertRow();

//         setTableData(tr, subAddress(tx_hash[i], "tx"));
//         setTableData(tr, tx_date[i]);
//         setTableData(tr, tx_time[i]);
//         setTableData(tr, subAddress(tx_contractAddress[i], "address"));
//         setTableData(tr, subAddress(tx_from[i], "address"));
//         setTableData(tr, subAddress(tx_to[i], "address"));
//         setTableData(tr, tx_value[i]);
//     }

//     return(tbl);
// }

// document.getElementById('container-transaction-table').appendChild(getTransactionTable());
