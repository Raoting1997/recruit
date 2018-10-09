import React, { Component } from 'react';
import { Menu } from 'element-react';
import { Link } from 'react-router-dom';

const menus = [{
  name: '用户管理',
  url: 'manager/user',
}, {
  name: '职位管理',
  url: 'manager/position',
}, {
  name: '简历管理',
  url: 'manager/resume',
}, {
  name: '职位分类管理',
  url: 'manager/category',
}];

export default class Sidebar extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      current: 'manager/user'
    }
  }

  componentDidMount() {
    let initCurrent;
    let hash = window.location.hash.replace('#/', '').split('/');

    menus.forEach(menu => {
      // 默认选中项
      if (!initCurrent) {
        initCurrent = menu.url;
      }

      // 匹配选中项
      if ((hash[0] && hash[1]) && menu.url == `${hash[0]}/${hash[1]}`) {
        initCurrent = menu.url;
      }
    });

    this.setState({
      current: initCurrent
    });
  }

  onSelect(path, paths) {
    this.setState({
      current: path
    });
  }

  render() {
    return (
      <div className="sidebar">
        <Menu defaultActive={this.state.current} className="el-menu-vertical" onSelect={this.onSelect.bind(this)}  theme="light">
          {
            menus.map((subMenu) => {
              if (subMenu.children && subMenu.children.length) {
                return (
                  <Menu.SubMenu key={subMenu.url}  index={subMenu.url} title={<span><span>{subMenu.name}</span></span>}>
                    {subMenu.children.map(menu => (
                    <Menu.Item key={menu.url} index={menu.url}><Link to={`/${menu.url}`}>{menu.name}</Link></Menu.Item>))}
                  </Menu.SubMenu>
                )
              }
              return (
                <Menu.Item key={subMenu.url} index={subMenu.url}>
                  <Link to={`/${subMenu.url}`}>
                    <span className="nav-text">{subMenu.name}</span>
                  </Link>
                </Menu.Item>
              )
            })
          }
        </Menu>
      </div>
    )
  }
}