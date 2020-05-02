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
  Table,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PictureWall from '@/components/PictureWall';
import WangEditer from '@/components/WangEditer';
import styles from './student.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleSubmit,
    handleModalVisible,
    handleDelete,
    form: { getFieldDecorator },
    current,
    options,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleSubmit(fieldsValue, props.current);
    });
  };
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };
  const normFile = url => {
    return url;
  };
  return (
    <Modal
      destroyOnClose
      title={current ? '编辑数据' : '新增数据'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      width={800}
    >
      <FormItem label="学号" {...formLayout}>
        {getFieldDecorator('sid', {
          rules: [{ required: true, message: '请输入学号' }],
          initialValue: current ? current.sid : '',
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="性别" {...formLayout}>
        {getFieldDecorator('sex', {
          rules: [{ required: true, message: '请输入性别' }],
          initialValue: current ? current.sex : '',
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="年龄" {...formLayout}>
        {getFieldDecorator('age', {
          rules: [{ required: true, message: '请输入年龄' }],
          initialValue: current ? current.age : '',
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="电话号码" {...formLayout}>
        {getFieldDecorator('telphone', {
          rules: [{ required: true, message: '请输入电话号码' }],
          initialValue: current ? current.telphone : '',
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="学分" {...formLayout}>
        {getFieldDecorator('score', {
          rules: [{ required: true, message: '请输入学分' }],
          initialValue: current ? current.score : '',
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ student, loading }) => ({
  student,
  loading: loading.models.student,
}))
@Form.create()
class Student extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    current: undefined,
  };
  columns = [
    {
      title: '学生ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: '学号',
      key: 'sid',
      dataIndex: 'sid',
    },
    {
      title: '性别',
      key: 'sex',
      dataIndex: 'sex',
    },
    {
      title: '年龄',
      key: 'age',
      dataIndex: 'age',
    },
    {
      title: '电话号码',
      key: 'telphone',
      dataIndex: 'telphone',
    },
    {
      title: '学分',
      key: 'score',
      dataIndex: 'score',
    },
    {
      title: '创建时间',
      key: 'created_at',
      dataIndex: 'created_at',

      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      key: 'updated_at',
      dataIndex: 'updated_at',

      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
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
      type: 'student/fetch',
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
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'student/fetch',
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
      type: 'student/fetch',
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
          type: 'student/remove',
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
        type: 'student/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      current: undefined,
    });
  };
  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      current: record,
    });
  };
  handleSubmit = (fields, current) => {
    const { dispatch } = this.props;
    const id = current ? current.id : '';
    dispatch({
      type: 'student/submit',
      payload: { ...fields, id },
    });

    message.success('操作成功');
    this.handleModalVisible();
  };
  handleDelete = currentItem => {
    Modal.confirm({
      title: '删除数据',
      content: '确定删除这条数据吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(currentItem.id),
    });
  };
  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'student/submit',
      payload: { id },
    });
  };
  render() {
    const { student: data, loading } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const parentMethods = {
      handleSubmit: this.handleSubmit,
      handleModalVisible: this.handleModalVisible,
      handleDelete: this.handleDelete,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="学生管理">
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
                  expandedRowRender={record => <p style={{ margin: 0 }}>{record.}</p>}
                />*/}
            <Table dataSource={data.list} columns={this.columns} />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} current={this.state.current} />
      </PageHeaderWrapper>
    );
  }
}

export default Student;
