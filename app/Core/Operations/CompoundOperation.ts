import {ICompoundOperation} from 'ICompoundOperation';
import {IOperation} from 'IOperation';
import {IUndoableOperation} from 'IUndoableOperation';

export class CompoundOperation<T> implements ICompoundOperation {
    public Operations: IOperation[] = [];

    public AddOperation(operation: IOperation): void {
        this.Operations.push(operation);
    }

    public RemoveOperation(operation: IOperation): void {
        this.Operations.remove(operation);
    }

    public Do(): Promise<void> {
        var sequence: Promise<void> = Promise.resolve();

        this.Operations.forEach((op: IOperation) => {
            sequence = sequence.then(() => {
                return op.Do();
            });
        });

        return sequence;
    }

    public Undo(): Promise<void> {
        var ops = this.Operations.clone().reverse();

        var sequence: Promise<void> = Promise.resolve();

        ops.forEach((op: IUndoableOperation) => {
            sequence = sequence.then(() => {
                return op.Undo()
            });
        });

        return sequence;
    }

    Dispose(): void {
        this.Operations.forEach((op: IOperation) => {
            op.Dispose();
        });
    }
}