const fs = require('fs');
const path = require('path');

class SidebarUtil {

  //メイン関数群
  //動かない
  getSidebarItem (targetdir) {
    let workingdir = process.cwd();
    let files = this.getFiles(workingdir, targetdir);
    
    return this.getFilepaths(files, targetdir).map((path) => {
      return "[" + path + " ]";
    }).join();
  };

  // サイドバーアイテムの作成 メイン
  getSidebarGroup (targetdir, title, isCollapsable = true) {
    let workingdir = process.cwd();

    let files = this.getFiles(workingdir, targetdir);

    let grouptitle = this.toTitle(title, targetdir);

    //サイドバーアイテムの作成
    let directoryGroup =  {
      // グループリストタイトル
      title: grouptitle,
      // グループリスト展開有無
      collapsable: isCollapsable,
      // ディレクトリ配下のファイルリスト作成
      children: this.getFilepaths(files, targetdir)
    };
    return directoryGroup;
  };

  // サイドバーアイテムの作成 メイン
  getSidebarList (isCollapsable = true) {
    //rootパス用
    let root = ['']
    //vuepressルートディレクトリ
    let workingdir = './docs';
  
    //root直下のファイル群はグループ化しないためファイルを単品で表示する。
    //root直下のファイル一覧取得
    let rootfiles = this.getRootFileItems(workingdir);

    //ファイルパスの生成
    let rootItems = rootfiles.map((file) => {
      //return '/' + file;
      return path.join(file);
    });
  
    //ディレクトリ一覧の取得
    let directores = this.getDirectores(workingdir);

    //サイドバーアイテムの作成（ディレクトリ毎）
    let directoryGroups = directores.map((directory) => {
      //サイドバーアイテムの作成
      return {
        // グループリストタイトル
        title: directory,
        // グループリスト展開有無
        collapsable: isCollapsable,
        // ディレクトリ配下のファイルリスト作成
        children: this.getFileitems(workingdir, directory)
      };
    });
    // root直下のファイル群とroot配下のディレクトリ群を結合してサイドバーのアイテムとする。
    // ※root直下のREADME.mdについては'/'で表現される。
    let sidebarList = root.concat(rootItems, directoryGroups);
  
    return sidebarList;
  };


  //ユーティリティ

  //グループタイトル変換
  toTitle(title, targetpath) {
    if (title === '') {
      return targetpath.replace('/', '');
    }
    return title;
  };

  // 対象ディレクトリ配下のファイルを取得
  getFilepaths(files, targetdir) {
    return files.map((file) => {
      // 子ディレクトリ配下にREADME.mdが存在する場合は子ディレクトリのパスとする。
      if (file === 'README.md') {
        // README.mdの場合は子ディレクトリ直下のパスとする。
        //return targetdir;
        return path.join(targetdir);
      }
      // README.md以外の場合は子ディレクトリ+ファイル名を返す。
      //return targetdir + file;
      return path.join(targetdir, file);
    });
  };

  getFiles (workingdir, targetpath) {
    //return fs.readdirSync(workingdir + targetpath).filter((file) => {
    return fs.readdirSync(path.join(workingdir, targetpath)).filter((file) => {
      //return isFile(workingdir + targetpath + file);
      return this.isFile(path.join(workingdir, targetpath, file));
    });
  };

  // 対象ディレクトリ配下のファイルを取得
  getFileitems(workingdir, targetdir) {
    //return fs.readdirSync(workingdir + "/" + targetdir).map((file) => {
    return fs.readdirSync(path.join(workingdir, targetdir)).map((file) => {
      // 子ディレクトリ配下にREADME.mdが存在する場合は子ディレクトリのパスとする。
      if (file === 'README.md') {
        // README.mdの場合は子ディレクトリ直下のパスとする。
        //return "/" + targetdir + "/"
        return path.join(targetdir);
      } 
      // README.md以外の場合は子ディレクトリ+ファイル名を返す。
      //return "/" + targetdir + "/" + file;
      return path.join(targetdir, file);
    })
  };
  // ディレクトリ一覧の取得
  getDirectores (workingdir) {
    // root配下のファイル＆ディレクトリ一覧取得
    return fs.readdirSync(workingdir).filter((childdir) => {
      // .vuepressのみ除外
      if (childdir === '.vuepress') {
        //対象ディレクトリが.vuepressの場合、false
        return false;
      }
      // ディレクトリの場合：true 対象がファイルであった場合はfalse
      //return isDirectory(workingdir + '/' + childdir);
      return this.isDirectory(path.join(workingdir, childdir));
    });
  };

  // ルート直下のファイルを取得（ex.README.md, privacy.md...etc）
  getRootFileItems (workingdir) {
    // root配下のファイル＆ディレクトリ一覧取得
    return fs.readdirSync(workingdir).filter((file) => {
      //root配下のREADME.mdは'/'で表現されるので排除する。
      if (file === 'README.md') {
        // README.mdの場合：false
        return false;
      }
      // ファイル存在判定 and マークダウンファイル判定
      //return isFile(workingdir + '/' + file);
      return this.isFile(path.join(workingdir, file));
    });
  };

  // ファイル存在確認（マークダウンファイル判定）
  isFile(targetpath) {
    return fs.existsSync(targetpath) && fs.statSync(targetpath).isFile() && path.extname(targetpath) === '.md';
  };

  // ディレクトリ存在確認
  isDirectory(targetpath) {
    // existsSyncは非推奨だから使わないほうが良い？
    // 参考；fs.statSyncでファイルの存在判定 - Qiita https://qiita.com/tokimari/items/82222e1f99b2b9eb1fb8
    // やっぱりこのままでいいっぽい
    // 参考：Node.js でディレクトリかどうかを判定する方法 | phiary http://phiary.me/nodejs-check-is-directory/
    // ディレクトリが存在する かつ 対象パスはディレクトリか否か
    return fs.existsSync(targetpath) && fs.statSync(targetpath).isDirectory();
  };
}
module.exports = new SidebarUtil();