/* eslint-disable no-unused-vars */

const Util = {

    /**
     * 获取本地git文件地址
     * @param {*} file 
     */
    getLocalFileName(fs, file) {
        let allLocalFile = []

        const docs = fs.readdirSync(file);
        docs.forEach(function (doc) {
            const _file = file + '/' + doc

            const st = fs.statSync(_file);

            const isVaild = _file.match(/.git\/config$/)
            const fileArr = _file.split('/')

            if (isVaild) {
                allLocalFile.push({
                    path: _file,
                    project: fileArr[fileArr.length - 3]
                })
            }

            // 如果是目录则递归调用自身
            if (st.isDirectory() && _file.indexOf('node_modules') < 0) {
                allLocalFile = allLocalFile.concat(Util.getLocalFileName(fs, _file))
            }
        })

        return allLocalFile
    },



    /**
     * 执行转换
     * @param {*} from 
     * @param {*} to 
     */
    transform: (fs, arrs, from, to) => {
        // 当前选择的

        let totalPaths = []

        for (let i of arrs) {
            totalPaths = totalPaths.concat(Util.getLocalFileName(fs, i))
        }

        // 支持转换的成功的
        const gitPaths = []
        for (let i of totalPaths) {
            try {
                const data = fs.readFileSync(i.path, 'utf8');
                if (data.indexOf(from) > -1) { // 匹配可以转化的
                    var formatted = data.replace(from, to);
                    try {
                        fs.writeFileSync(i.path, formatted, 'utf8');
                        // 写入成功
                        gitPaths.push({
                            ...i,
                            available: true
                        })
                    } catch (e) {
                        console.log('Error:', e.stack);
                        gitPaths.push({
                            ...i,
                            available: false
                        })
                    }
                } else if (data.indexOf(to) > -1) { // 匹配转化成功的
                    gitPaths.push({
                        ...i,
                        available: true
                    })
                } else { // 没有匹配到任何
                    gitPaths.push({
                        ...i,
                        available: false
                    })
                }
            } catch (e) {
                console.log('Error:', e.stack);
                gitPaths.push({
                    ...i,
                    available: false
                })
            }
        }
        return gitPaths
    }

}



export default Util