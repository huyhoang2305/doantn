import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const styles = {
    searchContainer: {
        marginBottom: '20px',
    },
    searchInput: {
        width: '100%',
        borderRadius: '8px',
    }
};

const SearchBar = ({ onSearch }) => {
    return (
        <div style={styles.searchContainer}>
            <Input
                size="large"
                placeholder="Tìm kiếm sản phẩm..."
                prefix={<SearchOutlined />}
                onChange={(e) => onSearch(e.target.value)}
                style={styles.searchInput}
            />
        </div>
    );
};

export default SearchBar;