const nickname = document.getElementsByName('nickname')[0].content;
const public_address = document.getElementsByName('public_address')[0].content;
const balance = parseFloat(document.getElementsByName('balance')[0].content).toFixed(2);


const App = () => {
    function getPortfolioTable() {
        return (
            <div className="portfolio_card">
                <table id="portfolio">
                    <thead>
                        <tr>
                            <th>Nickname</th>
                            <th>Address</th>
                            <th>ETH Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ width: "90px" }}>{ nickname }</td>
                            <td style={{ width: "250px" }} id="tabledata-portfolio-address">
                                <a href="" target="_blank" id="anchor-portfolio-address"> </a>
                            </td>
                            <td style={{ width: "120px" }} id="tabledata-portfolio-eth-balance"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    };

    return getPortfolioTable();
}

const domContainer = document.getElementById('container-portfolio-table');
ReactDOM.render(<App />, domContainer);

