/**
 * Teambuilder panel
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */

class TeambuilderPanel extends PSRoomPanel {
	curFolderKeep = '';
	curFolder = '';
	selectFolder = (e: MouseEvent) => {
		let elem = e.target as HTMLElement | null;
		let folder: string | null = null;
		while (elem) {
			if (elem.className === 'selectFolder') {
				folder = elem.getAttribute('data-value') || '';
				break;
			} else if (elem.className === 'folderlist') {
				return;
			}
			elem = elem.parentElement;
		}
		if (folder === null) return;
		this.curFolderKeep = folder;
		this.curFolder = folder;
		e.preventDefault();
		e.stopImmediatePropagation();
		this.forceUpdate();
	};
	renderFolderList() {
		// The folder list isn't actually saved anywhere:
		// it's regenerated anew from the team list every time.

		// (This is why folders you create will automatically disappear
		// if you leave them without adding anything to them.)

		let folderTable: {[folder: string]: 1 | undefined} = {};
		/**
		 * Folders, in a format where lexical sort will sort correctly.
		 */
		let folders: string[] = [];
		for (let i = -2; i < PS.teams.list.length; i++) {
			const team = i >= 0 ? PS.teams.list[i] : null;
			if (team) {
				let folder = team.folder;
				if (folder && !(`${folder}/` in folderTable)) {
					folders.push('Z' + folder);
					folderTable[folder + '/'] = 1;
					if (!('/' in folderTable)) {
						folders.push('Z~');
						folderTable['/'] = 1;
					}
				}
			}

			let format;
			if (i === -2) {
				format = this.curFolderKeep;
			} else if (i === -1) {
				format = this.curFolder;
			} else if (team) {
				format = team.format;
				if (!format) format = 'gen7';
			}
			if (!format) continue;
			if (format in folderTable) continue;
			folderTable[format] = 1;
			if (format.slice(-1) === '/') {
				folders.push('Z' + (format.slice(0, -1) || '~'));
				if (!('/' in folderTable)) {
					folders.push('Z~');
					folderTable['/'] = 1;
				}
				continue;
			}
			if (format === 'gen7') {
				folders.push('A~');
				continue;
			}
			switch (format.slice(0, 4)) {
			case 'gen1': format = 'G' + format.slice(4); break;
			case 'gen2': format = 'F' + format.slice(4); break;
			case 'gen3': format = 'E' + format.slice(4); break;
			case 'gen4': format = 'D' + format.slice(4); break;
			case 'gen5': format = 'C' + format.slice(4); break;
			case 'gen6': format = 'B' + format.slice(4); break;
			case 'gen7': format = 'A' + format.slice(4); break;
			default: format = 'X' + format; break;
			}
			folders.push(format);
		}
		folders.sort();

		let gen = '';
		let renderedFormatFolders = [
			<div class="foldersep"></div>,
			<TeamFolder cur={false} value="+">
				<i class="fa fa-plus"></i><em>(add format folder)</em>
			</TeamFolder>,
		];

		let renderedFolders: preact.ComponentChild[] = [];

		for (let format of folders) {
			let newGen = '';
			switch (format.charAt(0)) {
			case 'G': newGen = '1'; break;
			case 'F': newGen = '2'; break;
			case 'E': newGen = '3'; break;
			case 'D': newGen = '4'; break;
			case 'C': newGen = '5'; break;
			case 'B': newGen = '6'; break;
			case 'A': newGen = '7'; break;
			case 'X': newGen = 'X'; break;
			case 'Z': newGen = '/'; break;
			}
			if (gen !== newGen) {
				gen = newGen;
				if (gen === '/') {
					renderedFolders.push(...renderedFormatFolders);
					renderedFormatFolders = [];
					renderedFolders.push(<div class="foldersep"></div>);
					renderedFolders.push(<div class="folder"><h3>Folders</h3></div>);
				} else if (gen === 'X') {
					renderedFolders.push(<div class="folder"><h3>???</h3></div>);
				} else {
					renderedFolders.push(<div class="folder"><h3>Gen {gen}</h3></div>);
				}
			}
			let formatName;
			if (gen === '/') {
				formatName = format.slice(1);
				format = formatName + '/';
				if (formatName === '~') {
					formatName = '(uncategorized)';
					format = '/';
				} else {
					formatName = BattleLog.escapeHTML(formatName);
				}
				const isCurFolder = this.curFolder === format;
				renderedFolders.push(<TeamFolder cur={isCurFolder} value={format}>
					<i class={
						`fa ${isCurFolder ? 'fa-folder-open' : 'fa-folder'}${format === '/' ? '-o' : ''}`
					}></i>
					{formatName}
				</TeamFolder>);
				continue;
			}
			formatName = format.slice(1);
			if (formatName === '~') formatName = '';
			format = 'gen' + newGen + formatName;
			if (format.length === 4) formatName = '(uncategorized)';
			renderedFolders.push(<TeamFolder cur={this.curFolder === format} value={format}>
				<i class={'fa ' + (this.curFolder === format ? 'fa-folder-open-o' : 'fa-folder-o')}></i>
				{formatName}
			</TeamFolder>);
		}
		renderedFolders.push(...renderedFormatFolders);

		return <div class="folderlist" onClick={this.selectFolder}>
			<div class="folderlistbefore"></div>

			<TeamFolder cur={!this.curFolder} value="">
				<em>(all)</em>
			</TeamFolder>
			{renderedFolders}
			<div class="foldersep"></div>
			<TeamFolder cur={false} value="++">
				<i class="fa fa-plus"></i><em>(add folder)</em>
			</TeamFolder>

			<div class="folderlistafter"></div>
		</div>;
	}
	render() {
		const room = this.props.room;
		let teams = PS.teams.list;

		let filterFolder: string | null = null;
		let filterFormat: string | null = null;
		if (this.curFolder) {
			if (this.curFolder.slice(-1) === '/') {
				filterFolder = this.curFolder.slice(0, -1);
				teams = teams.filter(team => team.folder === filterFolder);
			} else {
				filterFormat = this.curFolder;
				teams = teams.filter(team => team.format === filterFormat);
			}
		}

		return <PSPanelWrapper room={room}>
			<div class="folderpane">
				{this.renderFolderList()}
			</div>
			<div class="teampane">
				{filterFolder ?
					<h2>
						<i class="fa fa-folder-open"></i> {filterFolder} {}
						<button class="button small" style="margin-left:5px" name="renameFolder">
							<i class="fa fa-pencil"></i> Rename
						</button> {}
						<button class="button small" style="margin-left:5px" name="promptDeleteFolder">
							<i class="fa fa-times"></i> Remove
						</button>
					</h2>
				: filterFolder === '' ?
					<h2><i class="fa fa-folder-open-o"></i> Teams not in any folders</h2>
				: filterFormat ?
					<h2><i class="fa fa-folder-open-o"></i> {filterFormat}</h2>
				:
					<h2>All Teams</h2>
				}
				<ul class="teamlist">
					{teams.map(team => <li key={PS.teams.getKey(team)}>
						<TeamBox team={team} />
					</li>)}
				</ul>
			</div>
		</PSPanelWrapper>;
	}
}

PS.roomTypes['teambuilder'] = {
	Model: PSRoom,
	Component: TeambuilderPanel,
	title: "Teambuilder",
};
