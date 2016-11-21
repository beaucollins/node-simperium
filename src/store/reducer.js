// @flow
/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { lensPath, set, dissocPath } from 'ramda';
/**
 * Internal dependencies
 */
import type {
	SaveBucketObjectAction,
	RemoveBucketObjectAction,
	SaveGhostAction,
	RemoveGhostAction,
	ReduxAction,
	QueueChangeAction
} from './actions';
import {
	BUCKET_OBJECT_SAVE,
	BUCKET_OBJECT_REMOVE,
	GHOST_SAVE,
	GHOST_REMOVE,
	BUCKET_QUEUE_CHANGE
} from './types';

const ghosts = ( state = {}, action: ReduxAction ): Object => {
	switch ( action.type ) {
		case GHOST_SAVE:
			const saveAction = ( ( action: any ): SaveGhostAction );
			return set(
				lensPath( [ saveAction.bucket, saveAction.key ] ),
				{ v: saveAction.version, o: saveAction.object },
				state
			);
		case GHOST_REMOVE:
			const removeAction = ( ( action: any ): RemoveGhostAction );
			return dissocPath( [ removeAction.bucket, removeAction.key ], state );
	}
	return state;
};

const buckets = ( state = {}, action: ReduxAction ): Object => {
	switch ( action.type ) {
		case BUCKET_OBJECT_SAVE:
			const saveAction = ( ( action: any ): SaveBucketObjectAction );
			return set(
				lensPath( [ saveAction.bucket, saveAction.key ] ),
				saveAction.object,
				state
			);
		case BUCKET_OBJECT_REMOVE:
			const removeAction = ( ( action: any ): RemoveBucketObjectAction );
			return dissocPath( [ removeAction.bucket, removeAction.key ], state );
	}
	return state;
};

const queue = ( state = { pending: {}, sent: {} }, action: ReduxAction ): Object => {
	switch ( action.type ) {
		case BUCKET_QUEUE_CHANGE:
			const queueAction = ( ( action: any ): QueueChangeAction );
			return set(
				lensPath( [ 'pending', queueAction.bucket, queueAction.key ] ),
				{ diff: queueAction.diff, v: queueAction.version },
				state
			);
	}
	return state;
};

export default combineReducers( { buckets, ghosts, queue } );
