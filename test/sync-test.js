// @flow
/**
 * External dependencies
 */
import { deepEqual } from 'assert';
import { createStore, applyMiddleware } from 'redux';
import { view, lensPath } from 'ramda';
import jsondiff from 'simperium-jsondiff';
/**
 * Internal dependencies
 */
import reducer from '../src/store/reducer';
import sync from '../src/store/sync';
import { saveBucketObject } from '../src/store/actions';

describe( 'sync middleware', () => {
	const { diff } = jsondiff();

	it( 'should queue change for new object', () => {
		const selectGhost = ( bucket, key, state ) => ( { v: 0, o: {} } );
		const { dispatch, getState } = createStore(
			reducer, {}, applyMiddleware( sync( selectGhost ) )
		);
		dispatch( saveBucketObject( 'notes', 'abcdefg', { title: 'hello world' } ) );

		deepEqual(
			view( lensPath( [ 'queue', 'pending', 'notes', 'abcdefg' ] ) )( getState() ),
			{ v: 0, diff: diff( {}, { title: 'hello world' } ) }
		);
	} );

	it( 'should queue change for existing object', () => {
		const selectGhost = ( bucket, key, state ) => ( { v: 1, o: { title: 'hello world' } } );
		const { dispatch, getState } = createStore(
			reducer, {}, applyMiddleware( sync( selectGhost ) )
		);
		dispatch( saveBucketObject( 'notes', 'abcdefg', { title: 'goodbye world' } ) );

		deepEqual(
			view( lensPath( [ 'queue', 'pending', 'notes', 'abcdefg' ] ) )( getState() ),
			{ v: 1, diff: diff( { title: 'hello world' }, { title: 'goodbye world' } ) }
		);
	} );
} );
