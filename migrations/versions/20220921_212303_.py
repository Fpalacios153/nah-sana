"""empty message

Revision ID: bea51d9ed696
Revises:
Create Date: 2022-09-21 21:23:03.221319

"""
from alembic import op
import sqlalchemy as sa
import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = 'bea51d9ed696'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=100), nullable=False),
    sa.Column('last_name', sa.String(length=100), nullable=False),
    sa.Column('role', sa.String(length=15), nullable=True),
    sa.Column('email', sa.String(length=100), nullable=False),
    sa.Column('hashed_password', sa.String(length=500), nullable=False),
    sa.Column('image', sa.String(length=100), nullable=True),
    sa.Column('pronouns', sa.String(length=15), nullable=True),
    sa.Column('department', sa.String(length=15), nullable=True),
    sa.Column('bio', sa.String(length=500), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )


    op.create_table('workspaces',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )

    op.create_table('projects',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('workspace_id', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('status', sa.String(length=15), nullable=True),
    sa.Column('due_date', sa.Date(), nullable=True),
    sa.Column('description', sa.String(length=500), nullable=True),
    sa.Column('icon', sa.String(length=100), nullable=True),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['workspace_id'], ['workspaces.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    op.create_table('user_workspaces',
    sa.Column('users', sa.Integer(), nullable=False),
    sa.Column('workspaces', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['users'], ['users.id'], ),
    sa.ForeignKeyConstraint(['workspaces'], ['workspaces.id'], ),
    sa.PrimaryKeyConstraint('users', 'workspaces')
    )

    op.create_table('tasks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('project_id', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('due_date', sa.Date(), nullable=True),
    sa.Column('description', sa.String(length=500), nullable=True),
    sa.Column('complete', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_projects',
    sa.Column('users', sa.Integer(), nullable=False),
    sa.Column('projects', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['projects'], ['projects.id'], ),
    sa.ForeignKeyConstraint(['users'], ['users.id'], ),
    sa.PrimaryKeyConstraint('users', 'projects')
    )
    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE workspaces SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE projects SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE user_workspaces SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE tasks SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE user_projects SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_projects')
    op.drop_table('tasks')
    op.drop_table('user_workspaces')
    op.drop_table('projects')
    op.drop_table('workspaces')
    op.drop_table('users')
    # ### end Alembic commands ###
