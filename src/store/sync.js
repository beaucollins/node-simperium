// @flow
/**
 * External dependencies
 */
import jsondiff from 'simperium-jsondiff';
/**
 * Internal dependencies
 */
import { BUCKET_OBJECT_SAVE } from './types';
import type { SaveBucketObjectAction } from './actions';
import { queueObjectChange } from './actions';

type Ghost = { v: number, o: Object };

export default ( selectGhost: ( bucket: string, key: string, state: Object )=>Ghost ) => {
	const { diff: differ } = jsondiff();
	return ( { dispatch, getState }: { dispatch: Function, getState: Function } ) =>
	( next: ( action: any ) => any ) => ( action: any ): any => {
		switch ( action.type ) {
			case BUCKET_OBJECT_SAVE:
				const saveAction = ( ( action: any ): SaveBucketObjectAction );
				const ghost = selectGhost( saveAction.bucket, saveAction.key, getState() );
				const diff = differ( ghost.o, saveAction.object );
				dispatch( queueObjectChange( saveAction.bucket, saveAction.key, ghost.v, diff ) );
				break;
		}
		return next( action );
	};
};
