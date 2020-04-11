import * as path from 'path';
export default {
    database:{
        enable: true,
        path: path.join(__dirname, '../lib/plugin/egg-database'),
    }
};

