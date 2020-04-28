const { firstUpperCase, obj2ObjStr } = require('../../extend/helper');
module.exports = (packageName, menuName, commentsObj, relationObj, structureObj) => {
  let hasRelation = Object.keys(relationObj).length > 0;
  let isRelationAllArr = true;
  if (hasRelation) {
    let values = Object.values(relationObj);
    values.forEach(val => {
      if (typeof val === 'String') {
        isRelationAllArr = false;
      }
    });
  }
  let keyNames = Object.keys(commentsObj);
  console.log('​keyNames', keyNames);
  let keyComments = Object.values(commentsObj);
  console.log('​keyComments', keyComments);
  let PackageName = firstUpperCase(packageName);
  let richTextKeyname = '';
  let result =
    `
    import React, { PureComponent, Fragment } from 'react';
    import { connect } from 'dva';
    import moment from 'moment';
    import {
      Row,
      Col,
      Card,
      Form,
      Input,
      Select,
      Icon,
      Button,
      Dropdown,
      Menu,
      InputNumber,
      DatePicker,
      Modal,
      message,
      Badge,
      Divider,
      Steps,
      Radio,
      Cascader,
      Table
    } from 'antd';
    import StandardTable from '@/components/StandardTable';
    import PageHeaderWrapper from '@/components/PageHeaderWrapper';
    import PictureWall from '@/components/PictureWall'
    import WangEditer from '@/components/WangEditer'
    import styles from './${packageName}.less';

    const FormItem = Form.Item;
    const { Step } = Steps;
    const { TextArea } = Input;
    const { Option } = Select;
    const RadioGroup = Radio.Group;
    const CreateForm = Form.create()(props => {
      const { modalVisible, form, handleSubmit, handleModalVisible, handleDelete, form: { getFieldDecorator }, current,options } = props;
      const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          form.resetFields();
          handleSubmit(fieldsValue,props.current);
        });
      };
      const formLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      };
      const normFile = (url) => {
        return url
      }
      return (
        <Modal
          destroyOnClose
          title={current? '编辑数据': '新增数据'}
          visible={modalVisible}
          onOk={okHandle}
          onCancel={() => handleModalVisible()}
          width={800}
        >` +
    (() => {
      let dom = '';
      keyNames.forEach((keyname, index) => {
        if (keyname !== 'id' && keyname !== 'created_at' && keyname !== 'updated_at') {
          if (relationObj[keyname]) {
            dom += `<FormItem label="${keyComments[index]}" {...formLayout}>
                {getFieldDecorator('${keyname}', {
                  rules: [{ required: true, message: '请选择${keyComments[index]}' }],
                  initialValue: current ? [current.${keyname}] : '',
                  getValueFromEvent: v => v.length>0?v.slice(-1): []
                })(<Cascader placeholder="请选择${keyComments[index]}" options={${
              isRelationAllArr ? obj2ObjStr(relationObj[keyname]) : 'options'
            }} expandTrigger="hover"/>)}
              </FormItem>`;
          } else {
            let structure = structureObj[keyname];
            let type = structure;
            let formItemStr = '';
            if (typeof structure === 'object') {
              type = structure.type;
            }
            console.log('​type', type);
            switch (type) {
              case 'img':
                formItemStr = `<FormItem label="${keyComments[index]}" {...formLayout}>
                {getFieldDecorator('${keyname}', {
                  rules: [{ required: true, message: '请输入${keyComments[index]}' }],
                  initialValue: current?current.${keyname}: '',
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile
                })(<PictureWall />)}
              </FormItem>
            `;
                break;
              case 'file':
                formItemStr = '';
                break;
              case type.startsWith('richtext') ? type : null:
                richTextKeyname = keyname;
                formItemStr = `<FormItem label="${keyComments[index]}" {...formLayout}>
                {getFieldDecorator('${keyname}', {
                  rules: [{ required: true, message: '请输入${keyComments[index]}' }],
                  initialValue: current?current.${keyname}: '',
                })(<WangEditer />)}
              </FormItem>`;
                break;
              default:
                formItemStr = `<FormItem label="${keyComments[index]}" {...formLayout}>
              {getFieldDecorator('${keyname}', {
                rules: [{ required: true, message: '请输入${keyComments[index]}' }],
                initialValue: current?current.${keyname}: '',
              })(<Input placeholder="请输入" />)}
            </FormItem>`;
            }
            dom += formItemStr;
          }
        }
      });
      return dom;
    })() +
    `</Modal>
      );
    });


    /* eslint react/no-multi-comp:0 */
    @connect(({ ${packageName}, loading ${isRelationAllArr ? '' : ''}}) => ({
      ${packageName},
      loading: loading.models.${packageName},
    }))
    @Form.create()
    class ${PackageName} extends PureComponent {
      state = {
        modalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        stepFormValues: {},
        current: undefined
      };
      columns = [` +
    (() => {
      let dom = '';
      keyNames.forEach((keyname, index) => {
        let render = '';
        if (keyname === 'created_at' || keyname === 'updated_at') {
          render = `
              render:val => moment(val).format('YYYY-MM-DD HH:mm:ss')`;
        } else {
          let structure = structureObj[keyname];
          let type = structure;
          if (typeof structure === 'object') {
            type = structure.type;
          }
          switch (type) {
            case 'img':
              render = "render: val => <img src={val} style={{width:100+'px',height:100+'px'}}/>";
              break;
            case type.startsWith('richtext') ? type : null:
              render =
                "render: val => <div dangerouslySetInnerHTML = {{ __html:val }} style={{maxHeight:'100px',maxWidth:'450px',overflow:'scroll'}}/>";
              break;
            case 'relate':
              if (relationObj[keyname]) {
                render = `render: val => ${obj2ObjStr(
                  relationObj[keyname]
                )}.find(item => item.value==val).label`;
              }
          }
        }
        dom += `
            {
              title: '${keyComments[index]}',
              key: '${keyname}',
              dataIndex: '${keyname}',
              ${render}},`;
      });
      return dom;
    })() +
    `
        {
          title: '操作',
          render: (text, record) => (
            <Fragment>
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleDelete(record)}>删除</a>
            </Fragment>
          ),
        },
      ];

      componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
          type: '${packageName}/fetch',
        });
      }

      handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
          const newObj = { ...obj };
          newObj[key] = getValue(filtersArg[key]);
          return newObj;
        }, {});

        const params = {
          currentPage: pagination.current,
          pageSize: pagination.pageSize,
          ...formValues,
          ...filters,
        };
        if (sorter.field) {
          params.sorter = \`\${sorter.field}_\${sorter.order}\`;
        }

        dispatch({
          type: '${packageName}/fetch',
          payload: params,
        });
      };

      handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
          formValues: {},
        });
        dispatch({
          type: '${packageName}/fetch',
          payload: {},
        });
      };

      toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
          expandForm: !expandForm,
        });
      };

      handleMenuClick = e => {
        const { dispatch } = this.props;
        const { selectedRows } = this.state;

        if (!selectedRows) return;
        switch (e.key) {
          case 'remove':
            dispatch({
              type: '${packageName}/remove',
              payload: {
                key: selectedRows.map(row => row.key),
              },
              callback: () => {
                this.setState({
                  selectedRows: [],
                });
              },
            });
            break;
          default:
            break;
        }
      };

      handleSelectRows = rows => {
        this.setState({
          selectedRows: rows,
        });
      };

      handleSearch = e => {
        e.preventDefault();

        const { dispatch, form } = this.props;

        form.validateFields((err, fieldsValue) => {
          if (err) return;

          const values = {
            ...fieldsValue,
            updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
          };

          this.setState({
            formValues: values,
          });

          dispatch({
            type: '${packageName}/fetch',
            payload: values,
          });
        });
      };

      handleModalVisible = flag => {
        this.setState({
          modalVisible: !!flag,
          current: undefined
        });
      };
      handleUpdateModalVisible = (flag,record) => {
        this.setState({
          modalVisible: !!flag,
          current: record
        });
      };
      handleSubmit = (fields, current) => {
        const { dispatch } = this.props;
        const id = current ? current.id : '';
        dispatch({
          type: '${packageName}/submit',
          payload: {...fields,id}
        });

        message.success('操作成功');
        this.handleModalVisible();
      };
      handleDelete = (currentItem) => {
        Modal.confirm({
          title: '删除数据',
          content: '确定删除这条数据吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(currentItem.id),
        });
      }
      deleteItem = (id)=> {
        const { dispatch } = this.props;
        dispatch({
          type: '${packageName}/submit',
          payload: { id },
        });
      }
      render() {
        const {
          ${packageName}: data,
          loading,
        } = this.props;
        const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
        const parentMethods = {
          handleSubmit: this.handleSubmit,
          handleModalVisible: this.handleModalVisible,
          handleDelete: this.handleDelete
        };
        const updateMethods = {
          handleUpdateModalVisible: this.handleUpdateModalVisible,
          handleUpdate: this.handleUpdate,
        };
        return (
          <PageHeaderWrapper title="${menuName}">
            <Card bordered={false}>
              <div className={styles.tableList}>

                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新建
                  </Button>

                </div>
                {/*<StandardTable
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  columns={this.columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                  expandedRowRender={record => <p style={{ margin: 0 }}>{record.${richTextKeyname}}</p>}
                />*/}
                <Table
                  dataSource={data.list}
                  columns={this.columns}
                  ${
                    richTextKeyname !== ''
                      ? 'expandedRowRender={record => <div dangerouslySetInnerHTML = {{ __html:record.' +
                        richTextKeyname +
                        '}} />}'
                      : ''
                  }
                />
              </div>
            </Card>
            <CreateForm {...parentMethods} modalVisible={modalVisible} current={this.state.current} ${
              hasRelation && !isRelationAllArr ? 'options={this.props.option}' : ''
            }/>
          </PageHeaderWrapper>
        );
      }
    }

    export default ${PackageName};


  `;
  return result;
};
