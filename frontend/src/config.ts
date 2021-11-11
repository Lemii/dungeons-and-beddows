const config = {
	blockTime: Number(process.env.REACT_APP_BLOCK_TIME) * 1000 || 4000,
	api: process.env.REACT_APP_WS_API || 'ws://localhost:8080/ws',
	fundPassphrase: process.env.REACT_APP_FUND_PASSPHRASE, // Only used for demo purposes
};

export default config;
