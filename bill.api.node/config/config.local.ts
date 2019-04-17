const mysql = {
    // 单数据库信息配置
    client: {
        // host
        host: '112.74.165.42',
        // 端口号
        port: '3306',
        // 用户名
        user: 'root',
        // 密码
        password: '123456',
        // 数据库名
        database: 'bill',
    },
    app: true,
    agent: false,
};
export default () => {
  return {
      mysql:mysql
  };
};
