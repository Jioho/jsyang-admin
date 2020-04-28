const { firstUpperCase } = require('../../extend/helper');
module.exports = (packageName, menuName, comments) => {
  console.log('​comments', comments);
  // let doubleQuotesComments = comments.replace(/'/g, '"')
  let temp = eval('(' + comments + ')');
  console.log('​temp', temp);
  let commentsJson = JSON.stringify(temp);
  console.log('​commentsJson', commentsJson);
  // console.log("​doubleQuotesComments", doubleQuotesComments)
  let commentsObj = JSON.parse(commentsJson);
  let keyNames = Object.keys(commentsObj);
  console.log('​keyNames', keyNames);
  let keyComments = Object.values(commentsObj);
  console.log('​keyComments', keyComments);
  let PackageName = firstUpperCase(packageName);
  let result =
    `
  import React, { PureComponent } from 'react';
  import { findDOMNode } from 'react-dom';
  import moment from 'moment';
  import { connect } from 'dva';
  import {
    List,
    Card,
    Row,
    Col,
    Radio,
    Input,
    Progress,
    Button,
    Icon,
    Dropdown,
    Menu,
    Avatar,
    Modal,
    Form,
    DatePicker,
    Select,
  } from 'antd';

  import PageHeaderWrapper from '@/components/PageHeaderWrapper';
  import Result from '@/components/Result';

  import styles from './${packageName}.less';

  const FormItem = Form.Item;
  const RadioButton = Radio.Button;
  const RadioGroup = Radio.Group;
  const SelectOption = Select.Option;
  const { Search, TextArea } = Input;

  @connect(({ ${packageName}, loading }) => ({
    ${packageName},
    loading: loading.models.${packageName},
  }))
  @Form.create()
  class ${PackageName} extends PureComponent {
    state = { visible: false, done: false };

    formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };

    componentDidMount() {
      const { dispatch } = this.props;
      dispatch({
        type: '${packageName}/fetch',
        payload: {
          count: 5,
        },
      });
    }

    showModal = () => {
      this.setState({
        visible: true,
        current: undefined,
      });
    };

    showEditModal = item => {
      this.setState({
        visible: true,
        current: item,
      });
    };

    handleDone = () => {
      setTimeout(() => this.addBtn.blur(), 0);
      this.setState({
        done: false,
        visible: false,
      });
    };

    handleCancel = () => {
      setTimeout(() => this.addBtn.blur(), 0);
      this.setState({
        visible: false,
      });
    };

    handleSubmit = e => {
      e.preventDefault();
      const { dispatch, form } = this.props;
      const { current } = this.state;
      const id = current ? current.id : '';

      setTimeout(() => this.addBtn.blur(), 0);
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        this.setState({
          done: true,
        });
        dispatch({
          type: '${packageName}/submit',
          payload: { id, ...fieldsValue },
        });
      });
    };

    deleteItem = id => {
      const { dispatch } = this.props;
      dispatch({
        type: '${packageName}/submit',
        payload: { id },
      });
    };

    render() {
      const {
        ${packageName}: { list },
        loading,
      } = this.props;
      const {
        form: { getFieldDecorator },
      } = this.props;
      const { visible, done, current = {} } = this.state;

      const editAndDelete = (key, currentItem) => {
        if (key === 'edit') this.showEditModal(currentItem);
        else if (key === 'delete') {
          Modal.confirm({
            title: '删除数据',
            content: '确定删除这条数据吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.deleteItem(currentItem.id),
          });
        }
      };

      const modalFooter = done
        ? { footer: null, onCancel: this.handleDone }
        : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

      const Info = ({ title, value, bordered }) => (
        <div className={styles.headerInfo}>
          <span>{title}</span>
          <p>{value}</p>
          {bordered && <em />}
        </div>
      );

      const extraContent = (
        <div className={styles.extraContent}>
          <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
        </div>
      );

      const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 5,
        total: 50,
      };

      const ListContent = ({ data: { ${keyNames} } }) => (
        <div className={styles.listContent}>` +
    (() => {
      let dom = '';
      keyNames.forEach((keyname, index) => {
        dom += `<div className={styles.listContentItem}>
        <span>${keyComments[index]}</span>
        <p>{${keyname}}</p>
      </div>
    `;
      });
      return dom;
    })() +
    `</div>
      );

      const MoreBtn = props => (
        <Dropdown
          overlay={
            <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
              <Menu.Item key="edit">编辑</Menu.Item>
              <Menu.Item key="delete">删除</Menu.Item>
            </Menu>
          }
        >
          <a>
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      );

      const getModalContent = () => {
        if (done) {
          return (
            <Result
              type="success"
              title="操作成功"
              description="一系列的信息描述，很短同样也可以带标点。"
              actions={
                <Button type="primary" onClick={this.handleDone}>
                  知道了
                </Button>
              }
              className={styles.formResult}
            />
          );
        }
        return (
          <Form onSubmit={this.handleSubmit}>` +
    (() => {
      let dom = '';
      keyNames.forEach((keyname, index) => {
        if (keyname !== 'id' && keyname !== 'created_at' && keyname !== 'updated_at') {
          dom += `<FormItem label="${keyComments[index]}" {...this.formLayout}>
                        {getFieldDecorator('${keyname}', {
                          rules: [{ required: true, message: '请输入${keyComments[index]}' }],
                          initialValue: current.${keyname},
                        })(<Input placeholder="请输入" />)}
                      </FormItem>
                    `;
        }
      });
      return dom;
    })() +
    `</Form>
        );
      };
      return (
        <PageHeaderWrapper>
          <div className={styles.standardList}>
            <Card
              className={styles.listCard}
              bordered={false}
              title="${menuName}"
              style={{ marginTop: 24 }}
              bodyStyle={{ padding: '0 32px 40px 32px' }}
              extra={extraContent}
            >
              <Button
                type="dashed"
                style={{ width: '100%', marginBottom: 8 }}
                icon="plus"
                onClick={this.showModal}
                ref={component => {
                  /* eslint-disable */
                  this.addBtn = findDOMNode(component);
                  /* eslint-enable */
                }}
              >
                添加
              </Button>
              <List
                size="large"
                rowKey="id"
                loading={loading}
                pagination={paginationProps}
                dataSource={list}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <a
                        onClick={e => {
                          e.preventDefault();
                          this.showEditModal(item);
                        }}
                      >
                        编辑
                      </a>,
                      <MoreBtn current={item} />,
                    ]}
                  >
                    <ListContent data={item} />
                  </List.Item>
                )}
              />
            </Card>
          </div>
          <Modal
            title={done ? null : \`数据\${current ? '编辑' : '添加'}\`}
            className={styles.standardListForm}
            width={640}
            bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
            destroyOnClose
            visible={visible}
            {...modalFooter}
          >
            {getModalContent()}
          </Modal>
        </PageHeaderWrapper>
      );
    }
  }

  export default ${PackageName};

  `;
  return result;
};
