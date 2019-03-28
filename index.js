const fs = require('fs');
const path = require('path');
const utils = require('utils.js');

class SidebarGen {

  constructor () {
    
  };

  //メイン関数群
  //動かない
  getSidebarItem (targetdir) {
    let workingdir = './docs';
    let files = utils.getFiles(workingdir, targetdir);
    
    return utils.getFilepaths(files, targetdir).map((path) => {
      return "[" + path + " ]";
    }).join();
  };

  // サイドバーアイテムの作成 メイン
  getSidebarGroup (targetdir, title, isCollapsable = true) {
    let workingdir = './docs';

    let files = utils.getFiles(workingdir, targetdir);

    let grouptitle = utils.toTitle(title, targetdir);

    //サイドバーアイテムの作成
    let directoryGroup =  {
      // グループリストタイトル
      title: grouptitle,
      // グループリスト展開有無
      collapsable: isCollapsable,
      // ディレクトリ配下のファイルリスト作成
      children: utils.getFilepaths(files, targetdir)
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
    let rootfiles = utils.getRootFileItems(workingdir);

    //ファイルパスの生成
    let rootItems = rootfiles.map((file) => {
      //return '/' + file;
      return path.join(file);
    });
  
    //ディレクトリ一覧の取得
    let directores = utils.getDirectores(workingdir);

    //サイドバーアイテムの作成（ディレクトリ毎）
    let directoryGroups = directores.map((directory) => {
      //サイドバーアイテムの作成
      return {
        // グループリストタイトル
        title: directory,
        // グループリスト展開有無
        collapsable: isCollapsable,
        // ディレクトリ配下のファイルリスト作成
        children: utils.getFileitems(workingdir, directory)
      };
    });
    // root直下のファイル群とroot配下のディレクトリ群を結合してサイドバーのアイテムとする。
    // ※root直下のREADME.mdについては'/'で表現される。
    let sidebarList = root.concat(rootItems, directoryGroups);
  
    return sidebarList;
  };



}
module.exports = new SidebarGen();