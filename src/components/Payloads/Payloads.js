import './Payloads.scss';

import * as AppActions from '../../actions';
import * as ConstantTypes from '../../AppConstants';

import { PageSection, Text, TextContent, TextVariants } from '@patternfly/react-core';
import React, { useCallback, useEffect, useState } from 'react';

import FilterToolbar from '../Filters/FilterToolbar';
import Pagination from '../Pagination';
import PropTypes from 'prop-types';
import Table from '../Table';
import { connect } from 'react-redux';
import { getValueFromURL } from '../../utilities/Common';

const queryBase = `${ConstantTypes.API_URL}/api/v1/payloads?`;

const Payloads = ({
    getPayloads, setSortDir, setSortBy, location, page, page_size, filters, startDate, endDate, recentTimeType
}) => {
    const [sortDir, updateDir] = useState(getValueFromURL(location, 'sort_dir') || 'desc');
    const [sortBy, updateBy] = useState(getValueFromURL(location, 'sort_by') || 'created_at');

    const search = useCallback(() => {
        let query = queryBase;
        query += `sort_by=${sortBy}&sort_dir=${sortDir}&page=${page - 1}&page_size=${page_size}`;
        query += filters.reduce((str, filter) => {
            const filterStr = Object.entries(filter).reduce((filter, [key, value]) => filter += `&${key}=${value}`, '');
            return str += filterStr;
        }, '');
        query += startDate ? `&${recentTimeType}_gte=${startDate}` : '';
        query += endDate ? `&${recentTimeType}_lte=${endDate}` : '';
        getPayloads(query);
    }, [getPayloads, sortBy, sortDir, page, page_size, filters, startDate, endDate, recentTimeType]);

    useEffect(() => {
        search();
    }, [sortDir, sortBy, page, page_size, filters, search, startDate, endDate, recentTimeType]);

    return <div className='pt-c-payloads__content'>
        <FilterToolbar options={ConstantTypes.PAYLOAD_FILTER_TYPES}/>
        <PageSection>
            <TextContent className='pt-c-header'>
                <Text component={TextVariants.h1}> Recorded Requests </Text>
            </TextContent>
            <Pagination>
                <Table
                    sortDir={sortDir}
                    setSortDir={(dir) => (setSortDir(dir), updateDir(dir))}
                    sortBy={sortBy}
                    setSortBy={(by) => (setSortBy(by), updateBy(by))}
                />
            </Pagination>
        </PageSection>
    </div>;
};

Payloads.propTypes = {
    getPayloads: PropTypes.func,
    setSortDir: PropTypes.func,
    setSortBy: PropTypes.func,
    location: PropTypes.object,
    page: PropTypes.number,
    page_size: PropTypes.number,
    filters: PropTypes.array,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    recentTimeType: PropTypes.string
};

const mapStateToProps = state => ({
    location: state.router.location,
    page: state.payloads.page,
    page_size: state.payloads.page_size,
    filters: state.payloads.filters,
    loading: state.data.loading,
    startDate: state.payloads.startDate,
    endDate: state.payloads.endDate,
    recentTimeType: state.payloads.recentTimeType
});

const mapDispatchToProps = dispatch => ({
    getPayloads: (url) => dispatch(AppActions.getData(url)),
    setSortDir: (dir) => dispatch(AppActions.setSortDir(dir)),
    setSortBy: (by) => dispatch(AppActions.setSortBy(by))
});

export default connect(mapStateToProps, mapDispatchToProps)(Payloads);
