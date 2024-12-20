const command = `powershell -Command "Get-Process | Where-Object { $_.ProcessName -match 'mcafee|Trend Micro Common Client Real-time Scan Service (64-bit)|avast|kaspersky|norton|trendmicro|pccNTMon|TmsaInstance64|CNTAoSMgr|TmListen|Ntrtscan' } | Select-Object Name, Id, CPU, MemoryUsage"`;

app.post('/api/client-info', (req, res) => {
    const clinetData = req.body.clinetData;

    //Inserting clinet data into MySQL (clinet table)
    const query = 'INSERT INTO client (hostname,ip_address,mac_address) VALUES (?,?,?)';
      const promises = clientData.map(interface => {
        return db.execute(query, [interface.interfaceName, interface.ipAddress, interface.macAddress,]);
    });

    Promise.all(promises)
        .then(() => res.send('Network data inserted successfully!'))
        .catch(err => res.status(500).send(err));
})


app.post('/api/network-info', (req, res) => {
    const networkData = req.body.networkData;
    
    // Insert network data into MySQL (network table)
    const query = 'INSERT INTO client (hostname, ip_address, mac_address) VALUES (?, ?, ?)';
    const promises = networkData.map(interface => {
        return db.execute(query, [interface.interfaceName, interface.ipAddress, interface.macAddress,]);
    });

    Promise.all(promises)
        .then(() => res.send('Network data inserted successfully!'))
        .catch(err => res.status(500).send(err));
});