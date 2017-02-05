var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
var accounts = web3.eth.accounts;

accounts.forEach(function(v) {
    $("#supportFrom").append("<option val=\"" + v + "\">" + v + "</option>");
    $("#projectAddr").append("<option val=\"" + v + "\">" + v + "</option>");
});

var compiled = web3.eth.compile.solidity(contractSource);

var code = compiled.code;
var abi = compiled.info.abiDefinition;

var contract = web3.eth.contract(abi);

var crowdfunder;

function parseAsyncDates(cb, f, prefix) {
    f(function(err, data) {
        if (!err && data) {
            cb(null, prefix + new Date(web3.toDecimal(data) * 1000));
        }
    });
}

function getAyncProjects(cb, f, prefix) {
    f(function(err, data) {
        if (!err && data) {
            var numProjects = web3.toDecimal(data);
            if (numProjects === 0) {
                cb(null, prefix + numProjects);
            } else {
                var indices = [];
                for(var i = 0; i<numProjects; i++) {
                    indices.push(i);
                }
                async.map(indices, function(i, cb) {
                    crowdfunder.projectAddresses(i, function(err, addr) {
                        if (!err) {
                            crowdfunder.getProjectInfo(addr, function(err, info) {
                                if (!err && info && info.length === 3) {
                                    var name = "<div>Name: " + info[0] + "</div>";
                                    var url = "<div>URL: " + info[1] + "</div>";
                                    var funds = "<div>Funds: " + web3.toDecimal(info[2]) + "</div>";
                                    cb(null, addr + name + url + funds);
                                } else {
                                    cb(err, "");
                                }
                            });
                        } else {
                            cb(err, "");
                        }
                    });
                }, function(err, results) {
                    if (!err) {
                        cb(null, prefix + data + results.map(function(address) {
                            return "<div>" + address  + "<br /></div>";
                        }).join(""));
                    }
                });
            }
        }
    });
}

function refreshData() {
    console.log('refreshing data');
    $("#statuscontent").html("");
    var addr = crowdfunder.address;
    $("#statuscontent").append("Contract Address: " + addr);
    async.parallel([
        function(cb) { parseAsyncDates(cb, crowdfunder.deadlineProjects, "<b>Proposal Deadline:</b> "); },
        function(cb) { parseAsyncDates(cb, crowdfunder.deadlineCampaign, "<b>Campaign Deadline:</b> "); },
        function(cb) { getAyncProjects(cb, crowdfunder.numberOfProjects, "<b>Proposals:</b> "); },
    ], function(err, results) {
        console.log(results);
        if (err) {
            console.error(err);
        }
        if (results && results.length > 0 ) {
            results.forEach(function(result) {
                $("#statuscontent").append("<div>" + result + "</div>");
            });
        }
    });
}

$("#contractBtn").click(function() {
    var entryFee = $("#entryFeeContract").val();
    var proposalDeadline = $("#proposalDeadline").val();
    var campaignDeadline = $("#campaignDeadline").val();
    contract.new(entryFee, proposalDeadline, campaignDeadline, {
        from: web3.eth.accounts[0],
        data: code,
        gas: 900000,
    }, function(err, contr) {
        if (err) {
            console.error('there was an error: ' + err);
            return;
        }

        if (!contr.address) {
            console.log("Contract transaction send: TransactionHash: " + contr.transactionHash + " waiting to be mined...");
        } else {
            console.log("Contract mined! Address: " + contr.address);
            crowdfunder = contr;
            refreshData();
        }
    });
});

$("#submitBtn").click(function() {
    crowdfunder.submitProject.sendTransaction($("#projectName").val(), $("#projectURL").val(), {
        from: $("#projectAddr").val(),
        value: $("#entryFeeProject").val(),
        gas: 600000,
    }, function(err, data) {
        console.log(data);
        if (err) {
            console.error(err);
        }
        refreshData();
    });
});

$("#supportBtn").click(function() {
    crowdfunder.supportProject.sendTransaction($("#supportAddr").val(), {
        from: $("#supportFrom").val(),
        value: $("#supportAmount").val(),
        gas: 150000,
    }, function(err, data) {
        if (err) {
            console.error(err);
        }
        refreshData();
    });
});

$("#finishBtn").click(function() {
    console.log('finished!');
    crowdfunder.finish({from: web3.eth.accounts[0]}, function(err, data) {
        if (err) {
            console.error(err);
        }
        refreshData();
    });
});

