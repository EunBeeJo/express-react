import React from 'react';
import Memo from './Memo';
import PropTypes from 'prop-types';

class MemoList extends React.Component {
  render() {
    const mapToComponents = data => {
      return data.map((memo, i) => {
        return (<Memo
                    data={memo}
                    ownership={ (memo.writer === this.props.currentUser) }
                    key={memo._id}
                    index={i}
                    onEdit={this.props.onEdit}
                    onRemove={this.props.onRemove}
                  />);
      });
    };

    return (
      <div>
        {mapToComponents(this.props.data)}
      </div>
    );
  }
}

MemoList.propTypes = {
  data: PropTypes.array,
  currentUser: PropTypes.string,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func
};

MemoList.defaultProps = {
  data: [],
  currentUser: '',
  onEdit: (id, index, contents) => {
    console.error('edit function not defined');
  },
  onRemove: (id, index) => {
    console.error('remove function not defined');
  }
};

export default MemoList;
