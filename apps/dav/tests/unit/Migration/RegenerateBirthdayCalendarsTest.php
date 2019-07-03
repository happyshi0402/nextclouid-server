<?php
/**
 * @copyright Copyright (c) 2018, Georg Ehrke
 *
 * @author Georg Ehrke <oc.list@georgehrke.com>
 *
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 *
 */

namespace OCA\DAV\Tests\unit\DAV\Migration;

use OCA\DAV\BackgroundJob\RegisterRegenerateBirthdayCalendars;
use OCA\DAV\Migration\RegenerateBirthdayCalendars;
use OCP\BackgroundJob\IJobList;
use OCP\IConfig;
use OCP\Migration\IOutput;
use Test\TestCase;

class RegenerateBirthdayCalendarsTest extends TestCase {

	/** @var IJobList | \PHPUnit_Framework_MockObject_MockObject */
	private $jobList;

	/** @var IConfig | \PHPUnit_Framework_MockObject_MockObject */
	private $config;

	/** @var RegenerateBirthdayCalendars */
	private $migration;

	protected function setUp() {
		parent::setUp();

		$this->jobList = $this->createMock(IJobList::class);
		$this->config = $this->createMock(IConfig::class);

		$this->migration = new RegenerateBirthdayCalendars($this->jobList,
			$this->config);
	}

	public function testGetName() {
		$this->assertEquals(
			'Regenerating birthday calendars to use new icons and fix old birthday events without year',
			$this->migration->getName()
		);
	}

	public function testRun() {
		$this->config->expects($this->at(0))
			->method('getAppValue')
			->with('dav', 'regeneratedBirthdayCalendarsForYearFix')
			->willReturn(null);

		$output = $this->createMock(IOutput::class);
		$output->expects($this->once())
			->method('info')
			->with('Adding background jobs to regenerate birthday calendar');

		$this->jobList->expects($this->at(0))
			->method('add')
			->with(RegisterRegenerateBirthdayCalendars::class);

		$this->config->expects($this->at(1))
			->method('setAppValue')
			->with('dav', 'regeneratedBirthdayCalendarsForYearFix', 'yes');

		$this->migration->run($output);
	}

	public function testRunSecondTime() {
		$this->config->expects($this->once())
			->method('getAppValue')
			->with('dav', 'regeneratedBirthdayCalendarsForYearFix')
			->willReturn('yes');

		$output = $this->createMock(IOutput::class);
		$output->expects($this->once())
			->method('info')
			->with('Repair step already executed');

		$this->jobList->expects($this->never())
			->method('add');

		$this->migration->run($output);
	}


}
