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
import styles from './good.less';

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
      <FormItem label="商品名称" {...formLayout}>
        {getFieldDecorator('title', {
          rules: [{ required: true, message: '请输入商品名称' }],
          initialValue: current ? current.title : '',
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="商品分类" {...formLayout}>
        {getFieldDecorator('category', {
          rules: [{ required: true, message: '请选择商品分类' }],
          initialValue: current ? [current.category] : '',
          getValueFromEvent: v => (v.length > 0 ? v.slice(-1) : []),
        })(
          <Cascader
            placeholder="请选择商品分类"
            options={[
              { label: '服装', value: 1 },
              { label: '食品', value: 2 },
              { label: '日常用品', value: 3 },
              { label: '电子产品', value: 4 },
              { label: '书籍', value: 5 },
            ]}
            expandTrigger="hover"
          />
        )}
      </FormItem>
      <FormItem label="商品图片" {...formLayout}>
        {getFieldDecorator('img', {
          rules: [{ required: true, message: '请输入商品图片' }],
          initialValue: current ? current.img : '',
          valuePropName: 'fileList',
          getValueFromEvent: normFile,
        })(<PictureWall />)}
      </FormItem>
      <FormItem label="商品详情" {...formLayout}>
        {getFieldDecorator('detail', {
          rules: [{ required: true, message: '请输入商品详情' }],
          initialValue: current ? current.detail : '',
        })(<WangEditer />)}
      </FormItem>
      <FormItem label="库存" {...formLayout}>
        {getFieldDecorator('storeNumber', {
          rules: [{ required: true, message: '请输入库存' }],
          initialValue: current ? current.storeNumber : '',
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="状态" {...formLayout}>
        {getFieldDecorator('status', {
          rules: [{ required: true, message: '请选择状态' }],
          initialValue: current ? [current.status] : '',
          getValueFromEvent: v => (v.length > 0 ? v.slice(-1) : []),
        })(
          <Cascader
            placeholder="请选择状态"
            options={[
              { label: '上架', value: 1 },
              { label: '下架', value: 2 },
              { label: '售罄', value: 3 },
            ]}
            expandTrigger="hover"
          />
        )}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ good, loading }) => ({
  good,
  loading: loading.models.good,
}))
@Form.create()
class Good extends PureComponent {
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
      title: '商品ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: '商品名称',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: '商品分类',
      key: 'category',
      dataIndex: 'category',
      render: val =>
        [
          { label: '服装', value: 1 },
          { label: '食品', value: 2 },
          { label: '日常用品', value: 3 },
          { label: '电子产品', value: 4 },
          { label: '书籍', value: 5 },
        ].find(item => item.value == val).label,
    },
    {
      title: '商品图片',
      key: 'img',
      dataIndex: 'img',
      render: val => <img src={val} style={{ width: 100 + 'px', height: 100 + 'px' }} />,
    },
    {
      title: '商品详情',
      key: 'detail',
      dataIndex: 'detail',
      render: val => (
        <div
          dangerouslySetInnerHTML={{ __html: val }}
          style={{ maxHeight: '100px', maxWidth: '450px', overflow: 'scroll' }}
        />
      ),
    },
    {
      title: '库存',
      key: 'storeNumber',
      dataIndex: 'storeNumber',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: val =>
        [
          { label: '上架', value: 1 },
          { label: '下架', value: 2 },
          { label: '售罄', value: 3 },
        ].find(item => item.value == val).label,
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
      type: 'good/fetch',
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
      type: 'good/fetch',
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
      type: 'good/fetch',
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
          type: 'good/remove',
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
        type: 'good/fetch',
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
      type: 'good/submit',
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
      type: 'good/submit',
      payload: { id },
    });
  };
  render() {
    const { good: data, loading } = this.props;
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
      <PageHeaderWrapper title="商品管理">
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
                  expandedRowRender={record => <p style={{ margin: 0 }}>{record.detail}</p>}
                />*/}
            <Table
              dataSource={data.list}
              columns={this.columns}
              expandedRowRender={record => (
                <div dangerouslySetInnerHTML={{ __html: record.detail }} />
              )}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} current={this.state.current} />
      </PageHeaderWrapper>
    );
  }
}

export default Good;
